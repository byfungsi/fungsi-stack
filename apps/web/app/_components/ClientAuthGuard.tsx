"use client";

import { PropsWithChildren, useEffect } from "react";
import { Center } from "@mantine/core";
import { SplineIcon } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import useVerifyQuery from "../_hooks/useVerify";
import { deleteServerToken } from "../_actions/deleteServerToken";
import { TOKEN_KEY } from "../_constants/keys";

const ClientAuthGuard = ({ children }: PropsWithChildren) => {
  const { isPending, error, isError } = useVerifyQuery();
  useEffect(() => {
    if (error) {
      deleteServerToken();
      deleteCookie(TOKEN_KEY);
      window.location.href = "/login";
    }
  }, [error]);
  if (!getCookie(TOKEN_KEY)) {
    window.location.href = "/login";
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
