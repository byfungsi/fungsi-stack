import { z } from "zod";
import { ZClient } from "../client";
/**
 * model Providers {
  id                   String   @id @default(uuid())
  clientId             String
  client               Client   @relation(fields: [clientId], references: [id])
  providerName         String
  providerClientId     String
  providerClientSecret String
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

 */

export const ZProvider = z.object({
  id: z.string(),
  clientId: z.string(),
  client: ZClient,
  providerName: z.string(),
  providerClientSecret: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
