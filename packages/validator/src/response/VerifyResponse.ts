import { z } from "zod";
import { ZUser } from "..";
import { ZBackendResponse } from ".";

export const ZVerifyResponse = ZBackendResponse.extend({
  data: z.object({
    user: ZUser,
  }),
});

export type TVerifyREsponse = z.infer<typeof ZVerifyResponse>;
