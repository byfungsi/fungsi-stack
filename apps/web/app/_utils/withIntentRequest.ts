import { ROUTES } from "@repo/validator";
import fidAxios from "./fidAxios";

export const withIntentRequest = <T>(axiosReq: () => Promise<T>) =>
  fidAxios.post(ROUTES.intent).then(axiosReq);
