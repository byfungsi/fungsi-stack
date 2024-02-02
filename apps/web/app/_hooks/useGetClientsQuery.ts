import { ROUTES } from "@repo/validator";
import { useQuery } from "@tanstack/react-query";
import fidAxios from "../_utils/fidAxios";
import { withIntentRequest } from "../_utils/withIntentRequest";

const getClients = () =>
  withIntentRequest(() => fidAxios.get(ROUTES.administrationClients));

export const useGetClientsQueryKey = () => ["administration", "clients"];

const useGetClientsQuery = () => {
  const query = useQuery({
    queryKey: useGetClientsQueryKey(),
    queryFn: getClients,
  });

  return query;
};

export default useGetClientsQuery;
