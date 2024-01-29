import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

if (fs.existsSync(path.join(__dirname, "../../../.env"))) {
  dotenv.config({ path: path.join(__dirname, "../../../.env") });
}

export default async function setup() {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  console.log("nangesss");
  execSync(`npx turbo db:down --filter database`, {
    env: {
      ...process.env,
    },
  });
}
