import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ZUser } from "@repo/validator";
import processSuccess from "../../../../utils/processSuccess";
import clientService from "../../../client/services";

const serviceName = "administrion/clients";

const getClients = asyncHandler(async (req: Request, res: Response) => {
  const servicePath = "getClients";
  res.locals.serviceName = serviceName;
  res.locals.servicePath = servicePath;
  const user = ZUser.parse(res.locals.user);

  const clients = await clientService.getClientsByOwnerId(user.id);

  processSuccess(res, serviceName, servicePath, clients);
});

export default getClients;
