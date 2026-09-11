import { defineConfig } from 'vitest/config';

/**
 * Vitest needs to be told to stay out of `.claude/worktrees/`.
 *
 * Agent isolation worktrees are full checkouts of this repo created *inside*
 * it. Vitest's default excludes cover `node_modules` and `dist` but not an
 * arbitrary nested checkout, so with worktrees present `npm test` discovered
 * every copy of the suite: 7 files and 238 tests where the repo has 1 and 34.
 *
 * That is worse than noise. One genuine failure — a raw `1px` in
 * progressBar.css — was reported four times, once per checkout, with paths
 * that all looked like different files. A reader cannot tell four bugs from
 * one bug seen four times.
 *
 * The paths are also gitignored, but that is a separate concern: git ignoring
 * a directory does not stop a test runner from globbing into it.
 */
export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/.claude/**', '**/storybook-static/**'],
  },
});
