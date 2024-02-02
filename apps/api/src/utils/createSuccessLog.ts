import { D } from "@mobily/ts-belt";
import { MESSAGE } from "../constants/message";

const stripSensitive = (data: any) =>
  D.deleteKeys(data, [
    "accessToken",
    "refreshToken",
    "password",
    "clientSecret",
  ]);

export const createSuccessLog = (
  serviceName: string,
  servicePath: string,
  data: any,
  message: string = MESSAGE.SUCCESS_RESPONSE,
) =>
  JSON.stringify({
    path: `/${serviceName}/${servicePath.replace(/^\//, "")}`,
    message,
    serviceName,
    servicePath,
    data: stripSensitive(data),
  });
