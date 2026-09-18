/**
 * Publishes one version of the package to npm.
 *
 *   npm run release:publish -- 0.1.0
 *   npm run release:publish -- 0.1.0 --dry-run
 *
 * In order, stopping at the first failure:
 *
 *   1. preflight   the version is valid semver and matches package.json, the
 *                  `"private": true` guard is present, the tree is clean, the
 *                  git tag is free, and the version is not on the registry
 *   2. gates       type check, tests, and `build:package`, all run again here
 *                  whatever ran before
 *   3. unguard     remove `"private": true` from package.json
 *   4. publish     `npm publish` (its prepublishOnly runs build and tests once
 *                  more against the exact tree being packed)
 *   5. reguard     put package.json back, byte for byte, and check it
 *   6. tag         annotated `v<version>` on HEAD
 *   7. smoke       install the published version into an empty folder and
 *                  render a component from it
 *
 * --dry-run runs every step with nothing leaving the machine: publish becomes
 * `npm publish --dry-run`, no tag is created, and the smoke test installs the
 * tarball from `npm pack` instead of the registry. A dirty tree is a warning
 * rather than a refusal, so the script can be exercised before committing.
 *
 * The guard. `"private": true` is what makes a stray `npm publish` refuse, so
 * the window in which it is absent must not outlive this process. The restore
 * is registered three ways, and deliberately not with try/finally:
 *
 *   inline   straight after publish returns, and checked
 *   exit     process.on('exit') — runs on normal completion, on an uncaught
 *            error, and when anything calls process.exit(). A `finally` block
 *            does not run in that last case, which is the failure this exists
 *            to prevent: the process ends, package.json stays publishable, and
 *            nothing says so.
 *   signals  SIGINT (Ctrl+C) and SIGTERM. Installing a handler replaces Node's
 *            default exit-on-signal, so the handler restores and then exits
 *            itself.
 *
 * Restoring is idempotent and writes the original file text back, so the
 * handlers can all fire without fighting. Only SIGKILL or power loss can skip
 * them; if that happens, `git diff package.json` shows it.
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = process.cwd();
const PKG_PATH = join(ROOT, 'package.json');

// ---------------------------------------------------------------- arguments

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const positional = args.filter((a) => !a.startsWith('--'));
const unknown = args.filter((a) => a.startsWith('--') && a !== '--dry-run');

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

if (unknown.length > 0 || positional.length !== 1 || !SEMVER.test(positional[0])) {
  console.error('usage: npm run release:publish -- <version> [--dry-run]');
  if (unknown.length > 0) console.error(`unknown option: ${unknown.join(' ')}`);
  process.exit(2);
}

const version = positional[0];
const tag = `v${version}`;
const mode = dryRun ? 'DRY RUN' : 'PUBLISH';

// ---------------------------------------------------------------- the guard

const originalText = readFileSync(PKG_PATH, 'utf8');
const pkg = JSON.parse(originalText);
let guardRemoved = false;

/** Put package.json back exactly as it was. Safe to call any number of times. */
function restoreGuard(from) {
  if (!guardRemoved) return true;
  try {
    writeFileSync(PKG_PATH, originalText);
    const restored = JSON.parse(readFileSync(PKG_PATH, 'utf8'));
    if (restored.private !== true) throw new Error('"private" is still not true after writing');
    guardRemoved = false;
    console.log(`✔ "private": true restored (${from})`);
    return true;
  } catch (err) {
    console.error('');
    console.error('✖✖✖ FAILED TO RESTORE "private": true IN package.json ✖✖✖');
    console.error(`    (${from}) ${err?.message ?? err}`);
    console.error('    The repo is publishable by accident until you fix it:');
    console.error('    git checkout -- package.json');
    console.error('');
    return false;
  }
}

process.on('exit', (code) => {
  if (!restoreGuard('on exit') && code === 0) process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.error(`\n${signal} received — stopping.`);
    restoreGuard(`on ${signal}`);
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

// ---------------------------------------------------------------- helpers

function step(title) {
  console.log(`\n── ${title}`);
}

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

/**
 * Runs a command and resolves with its exit code and captured output. Async
 * on purpose: a synchronous spawn blocks the event loop, and a signal handler
 * cannot run while it is blocked. `shell` is needed for npm.cmd on Windows;
 * every argument passed here is either fixed or the semver-validated version.
 */
function run(command, { cwd = ROOT, capture = false } = {}) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (d) => (stdout += d));
    child.stderr?.on('data', (d) => (stderr += d));
    child.on('close', (code) => resolvePromise({ code: code ?? 1, stdout, stderr }));
    child.on('error', (err) => resolvePromise({ code: 1, stdout, stderr: String(err) }));
  });
}

async function mustRun(command, options) {
  if (!options?.capture) console.log(`$ ${command}`);
  const result = await run(command, options);
  if (result.code !== 0) {
    if (options?.capture) process.stderr.write(result.stderr);
    fail(`\`${command}\` exited with ${result.code}`);
  }
  return result;
}

/** 'published' | 'absent', or fails when the registry cannot be asked. */
async function registryHas(spec) {
  const result = await run(`npm view ${spec} version`, { capture: true });
  if (result.code === 0 && result.stdout.trim() !== '') return 'published';
  // `npm view` exits 0 with empty output when the package exists but that
  // version does not, and E404 when the package has never been published.
  if (result.code === 0 || /E404/.test(result.stderr)) return 'absent';
  process.stderr.write(result.stderr);
  fail(`could not check the registry for ${spec}; refusing to publish blind`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- steps

async function preflight() {
  step(`1/7 preflight (${mode} ${pkg.name}@${version})`);

  if (pkg.version !== version) {
    fail(`package.json is at ${pkg.version}, not ${version}. Bump and commit it first.`);
  }
  if (pkg.private !== true) {
    fail('package.json has no "private": true. The guard is missing; restore it before releasing.');
  }

  const status = await mustRun('git status --porcelain', { capture: true });
  if (status.stdout.trim() !== '') {
    if (dryRun) console.warn('⚠ working tree is not clean (allowed for --dry-run)');
    else fail('working tree is not clean. Commit or stash first, so the tag matches what shipped.');
  }

  const tagCheck = await run(`git rev-parse -q --verify refs/tags/${tag}`, { capture: true });
  if (tagCheck.code === 0) fail(`git tag ${tag} already exists`);

  if ((await registryHas(`${pkg.name}@${version}`)) === 'published') {
    fail(`${pkg.name}@${version} is already on the registry. Versions cannot be republished.`);
  }
  console.log(`✔ ${pkg.name}@${version} is not on the registry`);

  if (!dryRun) {
    const who = await run('npm whoami', { capture: true });
    if (who.code !== 0) fail('not logged in to npm (`npm login`)');
    console.log(`✔ npm user: ${who.stdout.trim()}`);
  }
}

async function gates() {
  step('2/7 gates');
  await mustRun('npm run lint');
  await mustRun('npm test');
  await mustRun('npm run build:package');
  for (const file of ['index.js', 'index.cjs', 'index.d.ts', 'index.d.cts', 'styles.css', 'tokens.css']) {
    if (!existsSync(join(ROOT, 'dist', file))) fail(`build:package did not produce dist/${file}`);
  }
  console.log('✔ dist/ is complete');
}

async function publish() {
  step('3/7 remove "private": true');
  const unguarded = { ...pkg };
  delete unguarded.private;
  // Flag first: if the write lands and anything throws after it, the handlers
  // must already know there is something to put back.
  guardRemoved = true;
  writeFileSync(PKG_PATH, `${JSON.stringify(unguarded, null, 2)}\n`);
  console.log('✔ removed for this command only');

  step(`4/7 npm publish${dryRun ? ' --dry-run' : ''}`);
  const published = await run(`npm publish${dryRun ? ' --dry-run' : ''}`);

  step('5/7 restore "private": true');
  if (!restoreGuard('inline')) fail('guard not restored; see above');

  if (published.code !== 0) fail(`npm publish exited with ${published.code}`);
}

async function tagRelease() {
  step(`6/7 tag ${tag}`);
  if (dryRun) {
    console.log(`(dry run) would run: git tag -a ${tag} -m "${pkg.name}@${version}"`);
    return;
  }
  await mustRun(`git tag -a ${tag} -m "${pkg.name}@${version}"`);
  console.log(`✔ tagged. Push it with: git push origin ${tag}`);
}

async function smoke() {
  step('7/7 smoke test from an empty folder');
  const dir = mkdtempSync(join(tmpdir(), 'hds-smoke-'));
  console.log(`folder: ${dir}`);

  let spec;
  if (dryRun) {
    const packed = await mustRun(`npm pack --pack-destination "${dir}" --json`, { capture: true });
    const [{ filename }] = JSON.parse(packed.stdout);
    spec = `"${resolve(dir, filename)}"`;
  } else {
    spec = `${pkg.name}@${version}`;
    // The registry can take a moment to serve a version it just accepted.
    for (let attempt = 1; (await registryHas(spec)) !== 'published'; attempt += 1) {
      if (attempt === 10) fail(`${spec} still not visible on the registry after publishing`);
      await sleep(6000);
    }
  }

  const react = pkg.devDependencies.react;
  const reactDom = pkg.devDependencies['react-dom'];
  await mustRun('npm init -y', { cwd: dir, capture: true });
  await mustRun(`npm install --no-audit --no-fund ${spec} react@${react} react-dom@${reactDom}`, { cwd: dir });

  writeFileSync(
    join(dir, 'smoke.mjs'),
    `
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from ${JSON.stringify(pkg.name)};

const require = createRequire(import.meta.url);
const check = (ok, what) => { if (!ok) { console.error('✖ ' + what); process.exit(1); } console.log('✔ ' + what); };

const html = renderToStaticMarkup(createElement(Button, { label: 'Smoke test' }));
check(html.includes('class="hds-button"') && html.includes('Smoke test'), 'ESM: <Button> renders: ' + html.slice(0, 60) + '…');

const cjs = require(${JSON.stringify(pkg.name)});
check(typeof cjs.Button === 'function', 'CJS: require() exposes Button');

const styles = readFileSync(require.resolve(${JSON.stringify(`${pkg.name}/styles.css`)}), 'utf8');
check(styles.includes('.hds-button') && !/^\\s*@import/m.test(styles), 'styles.css resolves, is self-contained');

const tokens = readFileSync(require.resolve(${JSON.stringify(`${pkg.name}/tokens.css`)}), 'utf8');
check(/--semantic-/.test(tokens), 'tokens.css resolves and declares tokens');
`,
  );
  await mustRun('node smoke.mjs', { cwd: dir });

  rmSync(dir, { recursive: true, force: true });
}

// ---------------------------------------------------------------- main

async function main() {
  await preflight();
  await gates();
  await publish();
  await tagRelease();
  await smoke();
  console.log(`\n✔ ${mode} of ${pkg.name}@${version} complete`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
