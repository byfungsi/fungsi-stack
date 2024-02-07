import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";
import { TOKEN_KEY } from "../_constants/keys";

const ServerAuthGuard = async ({ children }: PropsWithChildren) => {
  if (!cookies().has(TOKEN_KEY)) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default ServerAuthGuard;
