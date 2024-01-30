import { z } from "zod";
import { ZUserSensitive } from "..";

export const ZCreateUserRequest = ZUserSensitive.pick({
  name: true,
  email: true,
  password: true,
});

export type TCreateUserRequest = z.infer<typeof ZCreateUserRequest>;
