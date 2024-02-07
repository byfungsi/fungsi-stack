import { TUser, ZUser } from "@repo/validator";
import { USER_KEY } from "../_constants/keys";

export const setUser = (user: TUser) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = () =>
  !localStorage.getItem(USER_KEY)
    ? null
    : ZUser.parse(JSON.parse(localStorage.getItem(USER_KEY) as string));
export const deleteUser = () => localStorage.removeItem(USER_KEY);
