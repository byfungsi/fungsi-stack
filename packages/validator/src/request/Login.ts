import { z } from "zod";
import { ZUserSensitive } from "..";

export const ZUserLogin = ZUserSensitive.pick({
  email: true,
  password: true,
});
export type TUserLogin = z.infer<typeof ZUserLogin>;
