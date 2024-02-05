import { Response } from "express";
import { G } from "@mobily/ts-belt";
import logger from "../core/logger";
import { createErrorLog } from "./createErrorLog";
import { createErrorResponse } from "./createErrorResponse";

type ErrFN = (err: Error) => number;
type StringCodeOrFN = number | ErrFN;

function handleError(
  err: Error,
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: StringCodeOrFN,
  errorCode: StringCodeOrFN,
) {
  const _errorCode = G.isFunction(errorCode) ? errorCode(err) : errorCode;
  const _httpCode = G.isFunction(httpCode) ? httpCode(err) : httpCode;
  logger.error(createErrorLog(serviceName, servicePath, _errorCode, err));
  res.status(_httpCode).json(createErrorResponse(_errorCode, err));
}

function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: StringCodeOrFN,
  errorCode: StringCodeOrFN,
): (err: Error) => void;
function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: StringCodeOrFN,
  errorCode: StringCodeOrFN,
  err?: Error,
): void;
function processError(
  serviceName: string,
  servicePath: string,
  res: Response,
  httpCode: StringCodeOrFN,
  errorCode: StringCodeOrFN,
  err?: Error,
) {
  if (G.isNullable(err)) {
    return (err: Error) =>
      handleError(err, serviceName, servicePath, res, httpCode, errorCode);
  }
  return handleError(err, serviceName, servicePath, res, httpCode, errorCode);
}

export default processError;
