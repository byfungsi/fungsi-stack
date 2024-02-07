import { ZClient, ZClientSensitive } from "@repo/validator";
import { A } from "@mobily/ts-belt";
import prismaClient from "../../../core/prismaClient";
import getOrThrowNotFound from "../../../utils/getOrThrowNotFound";
import ENTITIES from "../../../constants/entities";
import RESOURCES from "../../../constants/resources";
import randomStringAsBase64Url from "../../../utils/randomBase64";

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

const getClientsByOwnerId = (ownerId: string) =>
  prismaClient.clientOwner
    .findMany({
      where: {
        ownerId,
      },
      include: {
        client: true,
      },
    })
    .then(A.map((data) => data.client))
    .then(A.map(ZClient.parse));

const createClient = (ownerId: string, name: string) =>
  prismaClient.client.create({
    data: {
      name,
      secret: randomStringAsBase64Url(20),
      uniqueId: randomStringAsBase64Url(20),
      ClientOwner: {
        create: [
          {
            ownerId,
          },
        ],
      },
    },
  });

const clientService = {
  getClientByUniqueId,
  createClient,
  getClientBySecret,
  getClientsByOwnerId,
};

export default clientService;
