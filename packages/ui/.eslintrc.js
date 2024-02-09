/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["*.config.js", "*.config.ts"],
  rules: {
    "no-redeclare": "off",
  },
};
