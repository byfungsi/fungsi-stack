import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import processSuccess from "../../../../utils/processSuccess";

const serviceName = "administrion/clients";

const getClients = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "getClients";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;

  processSuccess(res, serviceName, servicePath, {}, "E eh nanti dulu");
});

export default getClients;
