import { z } from "zod";
import { ZUser } from "..";
import { ZBackendResponse } from ".";

export const ZCreateUserResponse = ZBackendResponse.extend({
  data: ZUser,
});

export type TCreateUserResponse = z.infer<typeof ZCreateUserResponse>;
