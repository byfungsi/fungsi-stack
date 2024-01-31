import { z } from "zod";

export const ZLogoutRequest = z.object({
  userId: z.string(),
});

export type TLogoutRequest = z.infer<typeof ZLogoutRequest>;
