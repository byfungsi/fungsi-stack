import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TITLES } from "../../_constants/titles";
import { TOKEN_KEY } from "../../_constants/keys";
import LoginPage from "./LoginPage";

export const metadata: Metadata = {
  title: TITLES.LOGIN,
};

export default function Page() {
  if (cookies().get(TOKEN_KEY)) {
    redirect("/welcome");
  }
  return <LoginPage />;
}
