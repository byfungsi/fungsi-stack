import { R } from "@mobily/ts-belt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_CODES } from "@repo/validator";
import getOrThrowNotFound from "../../../utils/getOrThrowNotFound";
import ENTITIES from "../../../constants/entities";
import RESOURCES from "../../../constants/resources";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import { SIGN_KEY } from "../../../constants/apiEnvs";
import accessTokenService from "../../accessToken/services";
import processSuccess from "../../../utils/processSuccess";
const serviceName = "auth";

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "refreshToken";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const RGetRefreshToken = R.fromExecution(() =>
    getOrThrowNotFound(
      ENTITIES.refreshToken,
      RESOURCES.cookies,
      req.cookies.refreshToken,
    ),
  );
  if (R.isError(RGetRefreshToken)) {
    R.tapError(
      RGetRefreshToken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.NOT_FOUND,
        ERROR_CODES.MISSING_REFRESH_TOKEN,
      ),
    );
    return;
  }
  const refreshToken = R.getExn(RGetRefreshToken);
  const RVerifyRefreshToken = R.fromExecution(() =>
    jwt.verify(refreshToken, SIGN_KEY),
  );
  if (R.isError(RVerifyRefreshToken)) {
    R.tapError(
      RVerifyRefreshToken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.UNAUTHORIZED,
        (err) => {
          if (err instanceof jwt.TokenExpiredError) {
            return ERROR_CODES.REFRESH_TOKEN_EXPIRED;
          }
          return ERROR_CODES.INVALID_JWT;
        },
      ),
    );
    return;
  }
  const accessTokenData =
    await accessTokenService.execRefreshTokenFlow(refreshToken);
  res.cookie("refreshToken", accessTokenData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  processSuccess(res, serviceName, servicePath, {
    accessToken: accessTokenData.accessToken,
  });
});

export default refreshToken;
