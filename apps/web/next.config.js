const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

if (fs.existsSync(path.join(__dirname, "../../.env"))) {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
};
