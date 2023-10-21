import url from "node:url";
import path from "node:path";
import * as glob from "glob";
import { Runtime } from "./src/runtime.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = glob.sync("./example/*.{js,cjs,mjs,ts,mts,tsx}", {
  cwd: __dirname,
});

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const runtime = new Runtime({
    files,
    viteServerConfig: {
      resolve: {
        alias: {
          "@example": path.resolve(__dirname, "./example"),
        },
      },
    },
  });

  await runtime.start<
    typeof import("@example/foo") | typeof import("@example/bar")
  >(async (module, filePath) => {
    // Ignore files that are not in the `files` glob.
    if (!files.includes(filePath)) return;

    const { default: MyClass } = await module;
    const mod = new MyClass();
    const params = mod.getParams();

    console.log(JSON.stringify(params, undefined, 2));
  });
}
