import {
  ROUTES,
  TCreateUserRequest,
  TCreateUserResponse,
} from "@repo/validator";
import { useMutation } from "@tanstack/react-query";
import fidAxios from "../_utils/fidAxios";
import { withIntentRequest } from "../_utils/withIntentRequest";

const register = (param: TCreateUserRequest) =>
  withIntentRequest(() =>
    fidAxios.post<TCreateUserResponse>(ROUTES.user, param),
  );

const useRegisterQuery = () => {
  const query = useMutation({
    mutationFn: register,
  });

  return query;
};

export default useRegisterQuery;
