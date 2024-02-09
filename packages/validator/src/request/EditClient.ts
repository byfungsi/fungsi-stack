import { z } from "zod";

export const ZEditClientRequest = z.object({
  name: z.string().optional(),
});

export type TCZEditClientRequest = z.infer<typeof ZEditClientRequest>;
