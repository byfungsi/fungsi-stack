import { migrate } from "drizzle-orm/postgres-js/migrator";
import { connection, db } from "./db";

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
  await connection.end();
}

main();
