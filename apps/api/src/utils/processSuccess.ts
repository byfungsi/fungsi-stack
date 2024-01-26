import { Response } from "express";
import logger from "../core/logger";
import HTTP_CODES from "../constants/httpCodes";
import { MESSAGE } from "../constants/message";
import { createSuccessLog } from "./createSuccessLog";
import { createSuccessResponse } from "./createSuccesResponse";

const processSuccess = (
  res: Response,
  serviceName: string,
  servicePath: string,
  data: any,
  message: string = MESSAGE.SUCCESS_RESPONSE,
  httpCode: number = HTTP_CODES.SUCCESS,
) => {
  logger.info(createSuccessLog(serviceName, servicePath, data, message));
  res.status(httpCode).json(createSuccessResponse(data, message));
};

export default processSuccess;
