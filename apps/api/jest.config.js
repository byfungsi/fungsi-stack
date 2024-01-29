/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  globalSetup: "./__test__/globalSetup.ts",
  globalTeardown: "./__test__/globalTeardown.ts",
  setupFilesAfterEnv: ["./__test__/setupEnvs.ts"],
};

module.exports = config;
