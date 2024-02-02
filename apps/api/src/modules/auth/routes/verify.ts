import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_CODES } from "@repo/validator";
import { R } from "@mobily/ts-belt";
import jwt from "jsonwebtoken";
import parseBearerToken from "../../../utils/parseBearerToken";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import { MESSAGE } from "../../../constants/message";
import accessTokenService from "../../accessToken/services";
import processSuccess from "../../../utils/processSuccess";
import { SIGN_KEY } from "../../../constants/apiEnvs";

const serviceName = "auth";

const verify = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "verify";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;

  const token = parseBearerToken(req);
  if (!token) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.UNAUTHORIZED,
      ERROR_CODES.MISSING_AUTHENTICATION_BEARER,
      new Error(MESSAGE.INVALID_SESSION),
    );
    return;
  }
  const RGetAccessToken = await R.fromPromise(
    accessTokenService.getAccessTokenByAccessToken(token),
  );
  if (R.isError(RGetAccessToken)) {
    R.tapError(
      RGetAccessToken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.NOT_FOUND,
        ERROR_CODES.ACCESS_TOKEN_NOT_FOUND,
      ),
    );
    return;
  }
  const accessTokenData = R.getExn(RGetAccessToken);
  const RVerifyRefreshTOken = R.fromExecution(() =>
    jwt.verify(accessTokenData.refreshToken, SIGN_KEY),
  );
  if (R.isError(RVerifyRefreshTOken)) {
    R.tapError(
      RVerifyRefreshTOken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.UNAUTHORIZED,
        ERROR_CODES.REFRESH_TOKEN_EXPIRED,
      ),
    );
    return;
  }
  res.cookie("refreshToken", accessTokenData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  const RVerifyToken = R.fromExecution(() =>
    jwt.verify(accessTokenData.accessToken, SIGN_KEY),
  );
  if (R.isError(RVerifyToken)) {
    R.tapError(
      RVerifyToken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.UNAUTHORIZED,
        ERROR_CODES.ACCESS_TOKEN_EXPIRED,
      ),
    );
    return;
  }
  processSuccess(res, serviceName, servicePath, {});
});

export default verify;
