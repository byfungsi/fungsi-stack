"use server";

import { cookies } from "next/headers";
import { TOKEN_KEY } from "../_constants/keys";

export async function deleteServerToken() {
  cookies().delete(TOKEN_KEY);
}
