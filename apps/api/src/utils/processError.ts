import { Response } from "express";
import { G } from "@mobily/ts-belt";
import logger from "../core/logger";
import { createErrorLog } from "./createErrorLog";
import { createErrorResponse } from "./createErrorResponse";

function handleError(
  err: Error,
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: number,
  errorCode: number,
) {
  logger.error(createErrorLog(serviceName, servicePath, errorCode, err));
  res.status(httpCode).json(createErrorResponse(errorCode, err));
}

function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: number,
  errorCode: number,
): (err: Error) => void;
function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: number,
  errorCode: number,
  err?: Error,
): void;
function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: number,
  errorCode: number,
  err?: Error,
) {
  if (G.isNullable(err)) {
    return (err: Error) =>
      handleError(err, serviceName, servicePath, res, httpCode, errorCode);
  }
  return handleError(err, serviceName, servicePath, res, httpCode, errorCode);
}

export default processError;
