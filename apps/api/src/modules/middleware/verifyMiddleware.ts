import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { R } from "@mobily/ts-belt";
import jwt from "jsonwebtoken";
import { ERROR_CODES, ZClient } from "@repo/validator";
import processError from "../../utils/processError";
import HTTP_CODES from "../../constants/httpCodes";
import clientService from "../client/services";
import parseBearerToken from "../../utils/parseBearerToken";
import { MESSAGE } from "../../constants/message";
import userServices from "../users/services";
import accessTokenService from "../accessToken/services";
import { SIGN_KEY } from "../../constants/apiEnvs";

const serviceName = "middleware";
const servicePath = "verifyMiddleware";

const verifyMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
    const user = await userServices.getUserById(
      accessTokenData.userId,
      accessTokenData.clientId,
    );
    const client = ZClient.parse(
      await clientService.getClientByUniqueId(accessTokenData.clientId),
    );

    res.locals.client = client;
    res.locals.user = user;
    next();
  },
);

export default verifyMiddleware;
