import { ROUTES, TGetClientsResponse } from "@repo/validator";
import { useQuery } from "@tanstack/react-query";
import fidAxios from "../_utils/fidAxios";

const getClients = () =>
  fidAxios.get<TGetClientsResponse>(ROUTES.administrationClients);

export const useGetClientsQueryKey = () => ["administration", "clients"];

const useGetClientsQuery = () => {
  const query = useQuery({
    queryKey: useGetClientsQueryKey(),
    queryFn: getClients,
  });

  return query;
};

export default useGetClientsQuery;
