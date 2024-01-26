import { ZClientSensitive } from "@repo/validator";
import prismaClient from "../../../core/prismaClient";
import getOrThrowNotFound from "../../../utils/getOrThrowNotFound";
import ENTITIES from "../../../constants/entities";
import RESOURCES from "../../../constants/resources";

const getClientByUniqueId = (clientId: string) =>
  prismaClient.client
    .findFirst({
      where: {
        uniqueId: clientId,
      },
    })
    .then(getOrThrowNotFound(ENTITIES.client, RESOURCES.database))
    .then(ZClientSensitive.parse);

const getClientBySecret = (secret: string) =>
  prismaClient.client
    .findFirst({
      where: {
        secret,
      },
    })
    .then(getOrThrowNotFound(ENTITIES.client, RESOURCES.database))
    .then(ZClientSensitive.parse);

const clientService = { getClientByUniqueId, getClientBySecret };

export default clientService;
