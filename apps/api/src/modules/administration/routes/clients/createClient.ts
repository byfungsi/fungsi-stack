import { R } from "@mobily/ts-belt";
import {
  ERROR_CODES,
  ZClient,
  ZCreateClientRequest,
  ZUser,
} from "@repo/validator";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import processError from "../../../../utils/processError";
import HTTP_CODES from "../../../../constants/httpCodes";
import clientService from "../../../client/services";
import processSuccess from "../../../../utils/processSuccess";
const serviceName = "clients";

const createClients = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "createClients";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;

  const user = ZUser.parse(res.locals.user);

  const RBodyValidation = R.fromExecution(() =>
    ZCreateClientRequest.parse(req.body),
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
  const client = await clientService.createClient(user.id, validatedBody.name);

  processSuccess(res, serviceName, servicePath, {
    client: ZClient.parse(client),
  });
});

export default createClients;
