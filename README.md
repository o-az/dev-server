# Build, watch, and run with live reload

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
node --loader=tsx runner.ts
```
