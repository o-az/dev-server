import { Runtime } from "./src/runtime.js";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const runtime = new Runtime({ directoryWatch: "./example" });

  await runtime.start(async (module) => {
    const { default: MyClass } = await module;
    const mod = new MyClass();
    console.log(`\nCalling getParams method:`, mod.getParams());
    console.log(`\nCalling getTimestamp method:`, mod.getTimestamp());
  });
}
