#!/usr/bin/env tsx
import * as esbuild from "esbuild";
import childProcess from "node:child_process";

Object.assign(process.env, { NODE_OPTIONS: "--no-warnings" });

const entryPoints = process.argv.toString().includes("-- ")
  ? process.argv[process.argv.indexOf("-- ") + 1]
  : "./example/index.ts";

const buildOptions = {
  bundle: true,
  format: "esm",
  platform: "node",
  treeShaking: true,
  target: ["esnext"],
  entryPoints: [entryPoints],
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
