import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
const serviceName = "auth";

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "refreshToken";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
});

export default refreshToken;
