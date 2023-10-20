import { Runtime } from "./src/runtime.js";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
const runtime = new Runtime({ directoryWatch: "./example" });

await runtime.start(async (module) => {
  const { default: ModuleClass } = await module;
  const mod = new ModuleClass();
  console.log(`\nCalling getParams from vite-node.ts:`, mod.getParams());
  console.log(
    `\nCalling getTimestamp from vite-node.ts:`,
    mod.getTimestamp()
  );
});
}
