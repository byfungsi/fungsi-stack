import { defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineProject({
  plugins: [react()],

  test: {
    name: "web",
    environment: "jsdom",
    globalSetup: "./__test__/globalSetup.ts",
    setupFiles: ["./__test__/setupEnvs.ts", "./__test__/setupDom.ts"],
  },
});
