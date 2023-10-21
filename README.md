# Build, watch, and run with live reload

___

Note: Requires Node.js LTS (20). If you don't have it and don't want to go through installation, prefix all commands with:

```sh
npx --package node@20 -- <command>
```

Example:

```sh
npx --package node@20 -- pnpm build
```
___

### ESBuild

#### To transpile TypeScript code to JavaScript then run it and watch for changes (live-reload)

```sh
node --loader=tsx esbuild.config.ts --watch -- ./example/index.ts
# or
pnpm build:watch -- ./example/index.ts
```

### vite-node

#### To programmatically execute code. See example in `./runner.ts`. To run the example

```sh
node --import=tsx runner.ts
# or
pnpm dev
```
