import { z } from "zod";

export const ZCreateClientSchema = z.object({
  name: z.string(),
});

export type TCreateClientSchema = z.infer<typeof ZCreateClientSchema>;
