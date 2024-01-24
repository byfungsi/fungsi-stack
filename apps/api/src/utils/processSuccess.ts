import { Response } from "express";
import logger from "../core/logger";
import HTTP_CODES from "../constants/httpCodes";
import { createSuccessLog } from "./createSuccessLog";
import { createSuccessResponse } from "./createSuccesResponse";

const processSuccess = (
  res: Response,
  serviceName: string,
  servicePath: string,
  data: any,
  httpCode: number = HTTP_CODES.SUCCESS,
) => {
  logger.info(createSuccessLog(serviceName, servicePath, data));
  res.status(httpCode).json(createSuccessResponse(data));
};

export default processSuccess;
