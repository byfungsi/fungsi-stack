import fs from "fs";
import path from "path";
import { config } from "dotenv";

if (fs.existsSync(path.join(__dirname, "../../../.env"))) {
  config({ path: path.join(__dirname, "../../../.env") });
}
