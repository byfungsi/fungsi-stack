import { z } from "zod";
import { zDateType } from "../utils/zDateTypes";
/**
 * model AccessToken {
  id           String   @id @default(uuid())
  accessToken  String
  refreshToken String
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  clientId     String
  client       Client   @relation(fields: [clientId], references: [uniqueId])
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
 */

export const ZAccessToken = z.object({
  id: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
  userId: z.string(),
  clientId: z.string(),
  createdAt: zDateType,
  updatedAt: zDateType,
});

export const ZAccessTokenCreate = ZAccessToken.pick({
  accessToken: true,
  refreshToken: true,
  userId: true,
  clientId: true,
});

export const ZAccessTokenQuery = ZAccessToken.pick({
  userId: true,
  clientId: true,
});

export const ZAccessTokenUpdate = ZAccessToken.pick({
  accessToken: true,
  refreshToken: true,
});

export type TAccessToken = z.infer<typeof ZAccessToken>;
export type TAccessTokenCreate = z.infer<typeof ZAccessTokenCreate>;
export type TAccessTokenQuery = z.infer<typeof ZAccessTokenQuery>;
export type TAccesTokenUpdate = z.infer<typeof ZAccessTokenUpdate>;
