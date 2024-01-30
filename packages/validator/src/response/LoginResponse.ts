import { z } from "zod";
import { ZUser } from "..";
import { ZBackendResponse } from ".";

export const ZLoginResponse = ZBackendResponse.extend({
  data: z.object({
    user: ZUser,
    accessToken: z.string(),
  }),
});

export type TLoginResponse = z.infer<typeof ZLoginResponse>;
