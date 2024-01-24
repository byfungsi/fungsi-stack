import { ERROR_CODES, ZUser, ZUserCreate } from "@repo/validator";
import asyncHandler from "express-async-handler";
import { R } from "@mobily/ts-belt";
import HTTP_CODES from "../../../constants/httpCodes";
import { hash } from "../../../utils/hash";
import userServices from "../services";
import processError from "../../../utils/processError";
import { MESSAGE } from "../../../constants/message";
import processSuccess from "../../../utils/processSuccess";

const serviceName = "user";
const createUser = asyncHandler(async (req, res) => {
  const servicePath = "create";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const bodyValidation = ZUserCreate.safeParse(req.body);
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
  const RCheckUserEmail = await R.fromPromise(
    userServices.getUserByEmail(validatedBody.email),
  );
  if (R.isError(RCheckUserEmail)) {
    R.tapError(
      RCheckUserEmail,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.BAD_REQUEST,
        ERROR_CODES.FAILED_CREATE_DB,
      ),
    );
    return;
  }
  const existingUser = R.toNullable(RCheckUserEmail);
  if (existingUser) {
    processError(
      serviceName,
      servicePath,
      res,
      HTTP_CODES.BAD_REQUEST,
      ERROR_CODES.UNIQUE_CONSTRAINT,
      new Error(MESSAGE.EMAIL_TAKEN),
    );
    return;
  }
  const hashedPassword = await hash(validatedBody.password);
  const RCreateUser = await R.fromPromise(
    userServices.createUser({
      ...validatedBody,
      password: hashedPassword,
    }),
  );
  if (R.isError(RCreateUser)) {
    R.tapError(
      RCreateUser,
      processError(
        serviceName,
        servicePath,
        res,
        HTTP_CODES.BAD_REQUEST,
        ERROR_CODES.FAILED_CREATE_DB,
      ),
    );
    return;
  }
  const data = R.toNullable(RCreateUser);
  processSuccess(res, serviceName, servicePath, ZUser.parse(data));
});

export default createUser;
