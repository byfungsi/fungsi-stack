import { Request } from "express";
import { G } from "@mobily/ts-belt";

const parseClientSecret = (req: Request): string | null => {
  const inCookies = req.cookies.clientSecret;
  if (G.isNullable(inCookies)) {
    return null;
  }
  return inCookies;
};

export default parseClientSecret;
