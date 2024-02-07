import { z } from "zod";
import { ZClient } from "..";
import { ZBackendResponse } from ".";

export const ZGetClientsResponse = ZBackendResponse.extend({
  data: z.array(ZClient),
});

export type TGetClientsResponse = z.infer<typeof ZGetClientsResponse>;
