import { Client } from "pg";
const client = new Client(process.env.DATABASE_URL);

async function main() {
  const s = new URL(process.env.DATABASE_URL as string);
  const schemaName = s.searchParams.get("schema");
  await client.connect();
  await client.query(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
}

main()
  .then(async () => {
    await client.end();
  })
  .catch(async (err) => {
    console.log(err);
    await client.end();
  });
