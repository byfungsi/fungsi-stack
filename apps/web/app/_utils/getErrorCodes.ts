import { ERROR_CODES } from "@repo/validator";
import { AxiosError } from "axios";

export const getErrorCode = (error: Error) => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.code) {
      return error.response.data.code;
    }
  }

  return ERROR_CODES.UNCAUGHT_ERROR;
};
