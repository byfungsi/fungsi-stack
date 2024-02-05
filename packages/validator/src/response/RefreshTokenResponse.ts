import { z } from "zod";
import { ZBackendResponse } from ".";

export const ZRefreshTokenResponse = ZBackendResponse.extend({
  data: z.object({
    accessToken: z.string(),
  }),
});

export type TRefreshTokenResponse = z.infer<typeof ZRefreshTokenResponse>;
