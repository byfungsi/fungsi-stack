import { defineConfig, configDefaults } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { setup } from "./__test__/globalSetup.js";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      "./src/index.ts",
    ],
    globalSetup: ["./__test__/globalSetup.ts"],
    setupFiles: ["./__test__/setupEnvs.ts"],
    testTimeout: 10000,
    pool: "forks",
    reporters: [
      "default",
      {
        async onWatcherRerun() {
          await setup();
        },
      },
    ],
  },
});
