import { ERROR_CODES } from "@repo/validator";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "@repo/database";
import { createErrorLog } from "../utils/createErrorLog";
import HTTP_CODES from "../constants/httpCodes";
import { createErrorResponse } from "../utils/createErrorResponse";
import logger from "./logger";
import { NotFoundError } from "./errors/NotFoundError";

const getErrorCode = (err: Error) => {
  if (err instanceof ZodError) {
    return ERROR_CODES.ZOD_UNCAUGHT_ERROR;
  }
  if (err instanceof NotFoundError) {
    return ERROR_CODES.NOT_FOUND_UNCAUGHT_ERROR;
  }
  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    return ERROR_CODES.PRISMA_UNCAUGHT_ERROR;
  }
  return ERROR_CODES.UNCAUGHT_ERROR;
};

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const errorCode = getErrorCode(err);
  logger.error(
    createErrorLog(
      res.locals.serviceName,
      res.locals.servicePath,
      errorCode,
      err as Error,
    ),
  );
  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json(createErrorResponse(errorCode, err as Error));
};

export default errorHandler;
