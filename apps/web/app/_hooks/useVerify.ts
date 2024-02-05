import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "@repo/validator";
import { withIntentRequest } from "../_utils/withIntentRequest";
import fidAxios from "../_utils/fidAxios";

const verify = () => withIntentRequest(() => fidAxios.post(ROUTES.verify));

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
