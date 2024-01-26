import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_CODES, ZClient } from "@repo/validator";
import { R } from "@mobily/ts-belt";
import jwt from "jsonwebtoken";
import parseBearerToken from "../../../utils/parseBearerToken";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import { MESSAGE } from "../../../constants/message";
import accessTokenService from "../../accessToken/services";
import processSuccess from "../../../utils/processSuccess";
import { SIGN_KEY } from "../../../constants/apiEnvs";

const serviceName = "user";

const verify = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "verify";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const client = ZClient.parse(res.locals.client);

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
  const RGetAccessToken = await R.fromPromise(
    accessTokenService.getAccessTokenByAccessToken(token, client.uniqueId),
  );
  if (R.isError(RGetAccessToken)) {
    R.tapError(
      RGetAccessToken,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.NOT_FOUND,
        ERROR_CODES.INVALID_JWT,
      ),
    );
    return;
  }
  const accessTokenData = R.getExn(RGetAccessToken);
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
        ERROR_CODES.JWT_EXPIRED,
      ),
    );
    return;
  }
  processSuccess(res, serviceName, servicePath, {});
});

export default verify;
