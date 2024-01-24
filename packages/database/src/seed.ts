import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

async function main() {
  await prisma.client.upsert({
    where: {
      uniqueId: process.env.SELF_CLIENT_ID,
      secret: process.env.SELF_CLIENT_SECRET,
    },
    update: {},
    create: {
      uniqueId: process.env.SELF_CLIENT_ID as string,
      secret: process.env.SELF_CLIENT_SECRET as string,
      name: "Self",
    },
  });
}

main()
  .then(async () => {
    console.log("SEED SUCCESS");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
