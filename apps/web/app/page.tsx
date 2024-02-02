import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES, withBaseUrl } from "@repo/validator";
import { TOKEN_KEY } from "./_constants/keys";
import { API_URL } from "./_constants/appEnv";

const RootPath = async () => {
  if (!cookies().get(TOKEN_KEY)) {
    redirect("/login");
  }
  const token = cookies().get(TOKEN_KEY);
  const res = await fetch(`${API_URL}${withBaseUrl(ROUTES.verify)}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token?.value}`,
    },
  });

  if (!res.ok) {
    redirect("/login");
  }
  redirect("/welcome");
};

export default RootPath;
