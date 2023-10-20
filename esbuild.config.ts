#!/usr/bin/env tsx
import * as esbuild from "esbuild";
import childProcess from "node:child_process";

Object.assign(process.env, { NODE_OPTIONS: "--no-warnings" });

const entryPoint = process.argv.at(-1) ?? "./src/index.ts";

const buildOptions = {
  bundle: true,
  format: "cjs",
  platform: "node",
  treeShaking: true,
  target: ["esnext"],
  external: ["vite-node", "lightningcss", "fsevents"],
  entryPoints: [entryPoint],
  outfile: "./dist/index.js",
} satisfies esbuild.BuildOptions;

if (!process.argv.includes("--watch")) {
  await esbuild
    .build(buildOptions)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

const context = await esbuild.context(buildOptions);

context
  .watch()
  .then(() => {
    console.log("Watching for changes...");
    const run = childProcess.spawn("node", ["--watch", "./dist/index.js"]);
    run.stdout.pipe(process.stdout);
    run.stderr.pipe(process.stderr);
  })
  .catch(() => process.exit(1));
