import { useMutation } from "@tanstack/react-query";
import { ROUTES, TLoginResponse, TUserLogin } from "@repo/validator";
import { withIntentRequest } from "../_utils/withIntentRequest";
import fidAxios from "../_utils/fidAxios";

const login = (param: TUserLogin) =>
  withIntentRequest(() => fidAxios.post<TLoginResponse>(ROUTES.login, param));

const useLoginQuery = () => {
  const query = useMutation({
    mutationFn: login,
  });

  return query;
};

export default useLoginQuery;
