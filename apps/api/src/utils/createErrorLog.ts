import { serializeError } from "./serializeError";

export const createErrorLog = (
  serviceName: string = "",
  servicePath: string = "",
  errorCodes: number,
  errorObject: any,
  additionalData?: any,
) =>
  JSON.stringify({
    path: `/${serviceName}/${servicePath.replace(/^\//, "")}`,
    serviceName,
    servicePath,
    errorCodes,
    errorObject:
      process.env.NODE_ENV === "production"
        ? serializeError(errorObject)
        : errorObject,
    additionalData,
  });
