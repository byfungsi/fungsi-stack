"use client";

import { PropsWithChildren, useEffect } from "react";
import { Center } from "@mantine/core";
import { SplineIcon } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import useVerifyQuery from "../_hooks/useVerify";
import { deleteServerToken } from "../_actions/deleteServerToken";
import { TOKEN_KEY } from "../_constants/keys";
import { deleteUser, setUser } from "../_utils/storage";

const ClientAuthGuard = ({ children }: PropsWithChildren) => {
  const { isPending, error, isError, data } = useVerifyQuery();
  const router = useRouter();
  useEffect(() => {
    if (error) {
      deleteServerToken();
      deleteCookie(TOKEN_KEY);
      deleteUser();
      router.replace("/login");
    }
  }, [error]);
  useEffect(() => {
    if (!data) return;
    setUser(data.data.data.user);
  }, [data]);
  if (!getCookie(TOKEN_KEY)) {
    router.replace("/login");
  }
  if (isPending || isError) {
    return (
      <Center>
        <SplineIcon className="animate-spin" />
      </Center>
    );
  }

  return children;
};

export default ClientAuthGuard;
