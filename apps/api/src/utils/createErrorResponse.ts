import { ZodError } from "zod";
import { Prisma } from "@repo/database";
import { serializeError } from "./serializeError";

export const createErrorResponse = (
  errorCode: number,
  err: Error,
  additionalData?: any,
) => {
  if (err instanceof ZodError) {
    return {
      code: errorCode,
      error: true,
      message: err.issues[0].message,
      detail: err.issues,
      additionalData,
    };
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return {
      code: errorCode,
      error: true,
      message: err.code,
      detail: {
        code: err.code,
      },
      additionalData,
    };
  }
  return {
    code: errorCode,
    error: true,
    message: err.message,
    detail: serializeError(err),
    additionalData,
  };
};
