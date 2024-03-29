import url from "node:url";
import type { ViteNodeServer } from "vite-node/server";
import type { ViteNodeRunner } from "vite-node/client";
import type { InlineConfig, ViteDevServer } from "vite";

const __filename = url.fileURLToPath(import.meta.url);

/**
 * @description vite-node runtime
 * @link https://github.com/vitest-dev/vitest/blob/main/packages/vite-node/README.md
 */
export class Runtime {
  #files: Array<string>;
  #viteServerConfig: InlineConfig;

  constructor({
    files,
    viteServerConfig,
  }: {
    files: Array<string>;
    viteServerConfig?: InlineConfig;
  }) {
    this.#files = files;
    this.#viteServerConfig = viteServerConfig;
  }

  /* Here you would set vite's `InlineConfig`, e.g., `root`, `resolve.alias`, etc. */
  async #createViteServer(
    viteServerConfig: InlineConfig = {
      clearScreen: false,
      optimizeDeps: { disabled: true },
      ...this.#viteServerConfig,
    }
  ) {
    const { createServer } = await import("vite");
    const server = await createServer(viteServerConfig);
    await server.pluginContainer.buildStart({});
    return server;
  }

  async #createViteNodeServer(viteServer: ViteDevServer) {
    const { ViteNodeServer } = await import("vite-node/server");
    const { installSourcemapsSupport } = await import("vite-node/source-map");
    const viteNodeServer = new ViteNodeServer(viteServer);
    installSourcemapsSupport({
      getSourceMap: (source) => viteNodeServer.getSourceMap(source),
    });
    return viteNodeServer;
  }

  async #createViteNodeRunner(
    viteServer: ViteDevServer,
    viteNodeServer: ViteNodeServer
  ) {
    const { ViteNodeRunner } = await import("vite-node/client");
    return new ViteNodeRunner({
      root: viteServer.config.root,
      base: viteServer.config.base,
      fetchModule: (id) => viteNodeServer.fetchModule(id),
      resolveId: (id, importer) => viteNodeServer.resolveId(id, importer),
    });
  }

  async #executeFile(filePath: string, runner: ViteNodeRunner) {
    try {
      await runner.executeFile(filePath);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Encoutered an error: ${error}`;
      console.error(errorMessage);
      console.error(error);
    }
  }

  public async start<T extends any>(
    handleModule: (module: Promise<T>, filePath: string) => void
  ) {
    const viteServer = await this.#createViteServer();
    const viteNodeServer = await this.#createViteNodeServer(viteServer);
    let viteNodeRunner = await this.#createViteNodeRunner(
      viteServer,
      viteNodeServer
    );

    console.info("Listening for changes…\n");

    this.#files.forEach((filePath) =>
      this.#executeFile(filePath, viteNodeRunner)
    );

    viteServer.watcher.on("all", async (eventName, affectedPath, _stats) => {
      console.log(`detected ${eventName} in ${affectedPath}`);
      if (affectedPath === __filename || eventName !== "change") return;
      const module = await viteNodeRunner.cachedRequest(
        affectedPath,
        affectedPath,
        []
      );
      handleModule(module, affectedPath);
      viteNodeRunner = await this.#createViteNodeRunner(
        viteServer,
        viteNodeServer
      );
    });
  }
}
