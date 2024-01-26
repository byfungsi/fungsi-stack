import { MESSAGE } from "../constants/message";

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
    data,
  });
