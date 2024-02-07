import { ROUTES } from "@repo/validator";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import fidAxios from "../_utils/fidAxios";
import { deleteServerToken } from "../_actions/deleteServerToken";
import { TOKEN_KEY } from "../_constants/keys";
import { deleteUser } from "../_utils/storage";

const logout = () => fidAxios.get(ROUTES.administrationClients);

const useLogout = () => {
  const query = useMutation({
    mutationFn: logout,
    onSettled: () => {
      deleteServerToken();
      deleteCookie(TOKEN_KEY);
      deleteUser();
      window.location.href = "/login";
    },
  });

  return query;
};

export default useLogout;
