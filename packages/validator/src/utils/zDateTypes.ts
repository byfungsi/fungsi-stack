import { z } from "zod";
import { stringToDateTransformer } from "./dateTransformer";

export const zDateType = z
  .union([z.date(), z.string()])
  .transform(stringToDateTransformer);
