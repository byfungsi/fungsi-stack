import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { R } from "@mobily/ts-belt";
import { ERROR_CODES } from "@repo/validator";
import getOrThrowNotFound from "../../utils/getOrThrowNotFound";
import processError from "../../utils/processError";
import HTTP_CODES from "../../constants/httpCodes";
import clientService from "../client/services";
import ENTITIES from "../../constants/entities";
import RESOURCES from "../../constants/resources";

const serviceName = "middleware";
const servicePath = "clientMiddleware";

const clientMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.locals.serviceName = serviceName;
    res.locals.servicePath = servicePath;
    console.log(req.cookies.clientSecret, "asli lur");
    const RGetClientSecret = R.fromExecution(() =>
      getOrThrowNotFound<string>(
        ENTITIES.clientSecret,
        RESOURCES.cookies,
        req.cookies.clientSecret,
      ),
    );
    if (R.isError(RGetClientSecret)) {
      R.tapError(
        RGetClientSecret,
        processError(
          serviceName,
          servicePath,
          res,
          HTTP_CODES.NOT_FOUND,
          ERROR_CODES.INVALID_CLIENT_SECRET,
        ),
      );
      return;
    }
    const clientSecret = R.getExn(RGetClientSecret);
    const RGetClient = await R.fromPromise(
      clientService.getClientBySecret(clientSecret),
    );
    if (R.isError(RGetClient)) {
      R.tapError(
        RGetClient,
        processError(
          serviceName,
          servicePath,
          res,
          HTTP_CODES.NOT_FOUND,
          ERROR_CODES.INVALID_CLIENT_SECRET,
        ),
      );
      return;
    }
    const client = R.getExn(RGetClient);

    res.locals.client = client;

    next();
  },
);

export default clientMiddleware;
