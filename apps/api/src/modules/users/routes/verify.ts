import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_CODES } from "@repo/validator";
import jwt from "jsonwebtoken";
import { R } from "@mobily/ts-belt";
import logger from "../../../core/logger";
import parseBearerToken from "../../../utils/parseBearerToken";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import { MESSAGE } from "../../../constants/message";
import { SIGN_KEY } from "../../../constants/apiEnvs";

const serviceName = "user";

const verify = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "verify";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const profiler = logger.startTimer();

  const token = parseBearerToken(req);
  if (!token) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.UNAUTHORIZED,
      ERROR_CODES.INVALID_JWT,
      new Error(MESSAGE.INVALID_SESSION),
    );
    return;
  }
  const RVerifyToken = R.fromExecution(() => jwt.verify(token, SIGN_KEY));
  if (R.isError(RVerifyToken)) {
    R.tapError(RVerifyToken, (err: Error) => {
      let errorObj = err;
      let errorCode: number = ERROR_CODES.INTERNAL_CLIENT_ERROR;
      if (err instanceof jwt.TokenExpiredError) {
        errorObj = new Error(MESSAGE.SESSION_EXPIRED);
        errorCode = ERROR_CODES.JWT_EXPIRED;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        errorObj = new Error(MESSAGE.INVALID_SESSION);
        errorCode = ERROR_CODES.INVALID_JWT;
      }
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.UNAUTHORIZED,
        errorCode,
        errorObj,
      );
    });
    return;
  }
  profiler.done();
});

export default verify;
