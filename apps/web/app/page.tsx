import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_KEY } from "./_constants/keys";

const RootPath = () => {
  if (!cookies().get(TOKEN_KEY)) {
    redirect("/login");
  }
  redirect("/welcome");
};

export default RootPath;
