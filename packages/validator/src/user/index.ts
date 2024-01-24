import { z } from "zod";

export const ZUser = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().nullable().optional(),
  firstName: z.string(),
  lastName: z.string(),
});

export const ZUserSensitive = ZUser.extend({
  password: z.string(),
});

export const ZUserCreate = ZUser.omit({
  id: true,
  emailVerified: true,
  phoneNumber: true,
}).extend({
  password: z.string(),
});

export const ZUserLogin = ZUserCreate.pick({
  email: true,
  password: true,
});

export type TUser = z.infer<typeof ZUser>;
export type TUserSensitve = z.infer<typeof ZUserSensitive>;

export type TUserCreate = z.infer<typeof ZUserCreate>;
export type TUserLogin = z.infer<typeof ZUserLogin>;
