import { defineProject, configDefaults } from "vitest/config";
import { setup, teardown } from "./__test__/globalSetup";

export default defineProject({
  test: {
    globals: true,
    globalSetup: ["./__test__/globalSetup.ts"],
    setupFiles: ["./__test__/setupEnvs.ts"],
    exclude: [...configDefaults.exclude],
    pool: "forks",
    testTimeout: 10000,
    reporters: [
      "default",
      {
        async onWatcherRerun() {
          await teardown();
          await setup();
        },
      },
    ],
  },
});
