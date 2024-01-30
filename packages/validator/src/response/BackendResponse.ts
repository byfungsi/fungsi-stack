import { z } from "zod";

export const ZBackendResponse = z.object({
  message: z.string(),
  error: z.boolean(),
  data: z.any(),
  meta: z.any(),
});
export type TBackendResponse = z.infer<typeof ZBackendResponse>;
