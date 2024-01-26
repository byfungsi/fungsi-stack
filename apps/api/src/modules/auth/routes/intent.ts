import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import { R } from "@mobily/ts-belt";
import { ERROR_CODES } from "@repo/validator";
import logger from "../../../core/logger";
import processError from "../../../utils/processError";
import HTTP_CODES from "../../../constants/httpCodes";
import { MESSAGE } from "../../../constants/message";
import processSuccess from "../../../utils/processSuccess";
import clientService from "../../client/services";
const serviceName = "auth";

const intent = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "intent";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const profiler = logger.startTimer();

  const schema = z.object({ clientId: z.string() });
  const RBodyValidation = R.fromExecution(() =>
    schema.parse({
      clientId: process.env.SELF_CLIENT_ID,
    }),
  );
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
  const RGetClientById = await R.fromPromise(
    clientService.getClientByUniqueId(validatedBody.clientId),
  );
  if (R.isError(RGetClientById)) {
    R.tapError(
      RGetClientById,
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
  const client = R.toNullable(RGetClientById);
  if (!client) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.NOT_FOUND,
      ERROR_CODES.DATA_NOT_FOUND_DB,
      new Error(MESSAGE.CLIENT_NOT_FOUND),
    );
    return;
  }
  res.cookie("clientSecret", client.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  profiler.done();
  processSuccess(res, serviceName, servicePath, {});
});

export default intent;
