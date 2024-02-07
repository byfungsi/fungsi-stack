import {
  ROUTES,
  TCreateClientRequest,
  TCreateClientResponse,
} from "@repo/validator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import fidAxios from "../_utils/fidAxios";
import { useGetClientsQueryKey } from "./useGetClientsQuery";

const createClient = (param: TCreateClientRequest) =>
  fidAxios.post<TCreateClientResponse>(ROUTES.administrationClients, param);

const useCreateClient = () => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: createClient,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: useGetClientsQueryKey() }),
  });

  return query;
};

export default useCreateClient;
