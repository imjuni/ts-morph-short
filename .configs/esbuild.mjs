import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

if (process.env.FORMAT !== 'cjs' && process.env.FORMAT !== 'esm') {
  console.log(`support "cjs" or "esm"`);
  console.log(`eg. FORMAT=cjs node esbuild.mjs`);

  process.exit(1);
}

console.log(`esbuild: ${process.env.FORMAT}`);
const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json')).toString(),
);

await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  sourcemap: true,
  // minify: true,
  outfile: process.env.FORMAT === 'cjs' ? 'dist/cjs/index.cjs' : 'dist/esm/index.mjs',
  format: process.env.FORMAT,
  external: [
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ],
});
