"use server";

import { cookies } from "next/headers";
import { TOKEN_KEY } from "../_constants/keys";

export async function setServerToken(token: string) {
  cookies().set(TOKEN_KEY, token, {
    secure: process.env.NODE_ENV === "production",
  });
}
