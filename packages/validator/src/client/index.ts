import { z } from "zod";
/**
 * model Client {
  id          String        @id @default(uuid())
  uniqueId    String        @unique
  secret      String        @unique
  name        String
  AccessToken AccessToken[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?
  Providers   Providers[]
}
 */

export const ZClient = z.object({
  id: z.string(),
  uniqueId: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional().nullable(),
});

export const ZClientSensitive = ZClient.extend({
  secret: z.string(),
});
