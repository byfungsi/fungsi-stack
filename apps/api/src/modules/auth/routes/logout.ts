import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ERROR_CODES, ZClient, ZLogoutRequest } from "@repo/validator";
import { R } from "@mobily/ts-belt";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import accessTokenService from "../../accessToken/services";
import processSuccess from "../../../utils/processSuccess";

const serviceName = "auth";

const logout = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "logout";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;

  const client = ZClient.parse(res.locals.client);
  const RBodyValidation = R.fromExecution(() => ZLogoutRequest.parse(req.body));
  if (R.isError(RBodyValidation)) {
    R.tapError(
      RBodyValidation,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.BAD_REQUEST,
        ERROR_CODES.INVALID_BODY,
      ),
    );
    return;
  }
  const validatedBody = R.getExn(RBodyValidation);
  await accessTokenService.deleteAccessTokenByUserId(
    client.uniqueId,
    validatedBody.userId,
  );

  processSuccess(res, serviceName, servicePath, {});
});

export default logout;
