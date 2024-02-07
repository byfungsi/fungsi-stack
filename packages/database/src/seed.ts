import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { hash } from "./hash";
import randomStringAsBase64Url from "./rand";

config();

const prisma = new PrismaClient();

async function main() {
  const client = await prisma.client.upsert({
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
  if (process.env.NODE_ENV === "test") {
    const user = await prisma.user.create({
      data: {
        name: "test",
        email: "test@mail.com",
        clientId: client.uniqueId,
        password: await hash("Password123"),
      },
    });
    await prisma.client.create({
      data: {
        name: "test_client",
        secret: randomStringAsBase64Url(20),
        uniqueId: randomStringAsBase64Url(20),
        ClientOwner: {
          create: {
            ownerId: user.id,
          },
        },
      },
    });
  }
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
