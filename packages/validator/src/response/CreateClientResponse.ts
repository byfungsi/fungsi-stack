import { z } from "zod";
import { ZClient } from "..";
import { ZBackendResponse } from ".";

export const ZCreateClientResponse = ZBackendResponse.extend({
  data: z.object({
    client: ZClient,
  }),
});

export type TCreateClientResponse = z.infer<typeof ZCreateClientResponse>;
