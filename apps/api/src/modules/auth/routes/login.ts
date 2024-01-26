import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { R } from "@mobily/ts-belt";
import { ERROR_CODES, ZClient, ZUser, ZUserLogin } from "@repo/validator";
import HTTP_CODES from "../../../constants/httpCodes";
import userServices from "../../users/services";
import { compare } from "../../../utils/hash";
import processError from "../../../utils/processError";
import processSuccess from "../../../utils/processSuccess";
import accessTokenService from "../../accessToken/services";
import { MESSAGE } from "../../../constants/message";

const serviceName = "auth";

const login = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "login";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const client = ZClient.parse(res.locals.client);
  const bodyValidation = ZUserLogin.safeParse(req.body);
  if (!bodyValidation.success) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.BAD_REQUEST,
      ERROR_CODES.INVALID_BODY,
      bodyValidation.error,
    );
    return;
  }
  const { data: validatedBody } = bodyValidation;
  const RGetUserByEmail = await R.fromPromise(
    userServices.getUserByEmailSensitive(validatedBody.email, client.uniqueId),
  );
  if (R.isError(RGetUserByEmail)) {
    R.tapError(
      RGetUserByEmail,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.NOT_FOUND,
        ERROR_CODES.DATA_NOT_FOUND_DB,
      ),
    );
    return;
  }
  const user = R.getExn(RGetUserByEmail);

  const isPasswordMatch = await compare(validatedBody.password, user.password);

  if (!isPasswordMatch) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.UNAUTHORIZED,
      ERROR_CODES.WRONG_PASSWORD,
      new Error(MESSAGE.INVALID_EMAIL_PASS_LOGIN),
    );
    return;
  }

  const RGetAccessTokenData = await R.fromPromise(
    accessTokenService.getOrCreateAccessTokenByUser(user.id, client.uniqueId),
  );
  if (R.isError(RGetAccessTokenData)) {
    R.tapError(
      RGetAccessTokenData,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
      ),
    );
    return;
  }
  const accessTokenData = R.getExn(RGetAccessTokenData);
  res.cookie("refreshToken", accessTokenData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  processSuccess(res, serviceName, servicePath, {
    user: ZUser.parse(user),
    accessToken: accessTokenData.accessToken,
  });
});

export default login;
