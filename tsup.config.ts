import { defineConfig } from 'tsup';

/**
 * The library build: src/index.ts only, so nothing outside the public surface
 * becomes importable by path. CSS is not tsup's job — components import none,
 * and scripts/build-css.mjs writes dist/styles.css and dist/tokens.css after
 * this runs (`clean` would otherwise delete them).
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outDir: 'dist',
  external: ['react', 'react-dom'],
});
