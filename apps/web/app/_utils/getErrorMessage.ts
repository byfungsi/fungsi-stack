import { AxiosError } from "axios";

export const getErrorMessage = (error: Error) => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
  }

  return error.message;
};
