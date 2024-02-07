import { useQuery } from "@tanstack/react-query";
import { ROUTES, TVerifyREsponse } from "@repo/validator";
import fidAxios from "../_utils/fidAxios";

const verify = () => fidAxios.post<TVerifyREsponse>(ROUTES.verify);

const useVerifyQuery = () => {
  const query = useQuery({
    queryKey: ["verify"],
    queryFn: verify,
    staleTime: 0,
    gcTime: 0,
  });

  return query;
};

export default useVerifyQuery;
