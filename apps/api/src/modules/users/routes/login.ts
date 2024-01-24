import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { R } from "@mobily/ts-belt";
import { ERROR_CODES, ZUser, ZUserLogin } from "@repo/validator";
import HTTP_CODES from "../../../constants/httpCodes";
import userServices from "../services";
import { compare } from "../../../utils/hash";
import { MESSAGE } from "../../../constants/message";
import { SIGN_KEY } from "../../../constants/apiEnvs";
import {
  JWT_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_TIME,
} from "../../../constants/appConstants";
import processError from "../../../utils/processError";
import processSuccess from "../../../utils/processSuccess";

const serviceName = "user";

const login = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "login";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
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
    userServices.getUserByEmail(validatedBody.email),
  );
  const user = R.toNullable(RGetUserByEmail);
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
  if (!user) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.UNAUTHORIZED,
      ERROR_CODES.DATA_NOT_FOUND_DB,
      new Error(MESSAGE.INVALID_EMAIL_PASS_LOGIN),
    );
    return;
  }
  const isMatchPassword = compare(validatedBody.password, user.password);
  if (!isMatchPassword) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.BAD_REQUEST,
      ERROR_CODES.WRONG_PASSWORD,
      new Error(MESSAGE.INVALID_EMAIL_PASS_LOGIN),
    );
    return;
  }
  const accessToken = jwt.sign(user, SIGN_KEY, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
  const refreshToken = jwt.sign(user, SIGN_KEY, {
    expiresIn: JWT_REFRESH_TOKEN_TIME,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  processSuccess(res, serviceName, servicePath, {
    user: ZUser.parse(user),
    accessToken,
  });
});

export default login;
