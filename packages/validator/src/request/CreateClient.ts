import { z } from "zod";

export const ZCreateClientRequest = z.object({
  name: z.string(),
});

export type TCreateClientRequest = z.infer<typeof ZCreateClientRequest>;
