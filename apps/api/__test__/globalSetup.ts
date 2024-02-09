import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

if (fs.existsSync(path.join(__dirname, "../../../.env"))) {
  dotenv.config({ path: path.join(__dirname, "../../../.env") });
}

export async function setup() {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
  process.env.API_PORT = 9002 as any;
  console.log("setup start");
  execSync(
    `npx turbo db:down --filter database && npx turbo db:push --filter database `,
    {
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
    },
  );
}
