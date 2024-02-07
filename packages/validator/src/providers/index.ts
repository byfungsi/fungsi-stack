import { z } from "zod";
import { ZClient } from "../client";
import { zDateType } from "../utils/zDateTypes";
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
  createdAt: zDateType,
  updatedAt: zDateType,
});
