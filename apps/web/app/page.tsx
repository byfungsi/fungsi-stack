import { redirect } from "next/navigation";

const RootPath = () => {
  redirect("/login");
};

export default RootPath;
