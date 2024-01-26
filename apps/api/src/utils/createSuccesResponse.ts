import { MESSAGE } from "../constants/message";

export const createSuccessResponse = (
  data: any,
  message: string = MESSAGE.SUCCESS_RESPONSE,
  meta?: any,
) => ({
  error: false,
  data,
  message,
  meta,
});
