import { z } from "zod";

/**
 * model User {
  id            String        @id @default(uuid())
  email         String        @unique
  emailVerified Boolean       @default(false)
  phoneNumber   String?       @unique
  password      String
  AccessToken   AccessToken[]
  deletedAt     DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

 */

export const ZUser = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ZUserSensitive = ZUser.extend({
  clientId: z.string(),
  password: z.string(),
});

export const ZUserCreate = ZUserSensitive.pick({
  email: true,
  password: true,
  clientId: true,
});

export const ZUserLogin = ZUserSensitive.pick({
  email: true,
  password: true,
});

export type TUser = z.infer<typeof ZUser>;
export type TUserSensitve = z.infer<typeof ZUserSensitive>;

export type TUserCreate = z.infer<typeof ZUserCreate>;
export type TUserLogin = z.infer<typeof ZUserLogin>;
