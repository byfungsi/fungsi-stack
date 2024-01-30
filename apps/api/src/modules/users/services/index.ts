import { TUserCreate, ZUser, ZUserSensitive } from "@repo/validator";
import { A } from "@mobily/ts-belt";
import prismaClient from "../../../core/prismaClient";
import getOrThrowNotFound from "../../../utils/getOrThrowNotFound";
import ENTITIES from "../../../constants/entities";
import RESOURCES from "../../../constants/resources";

const getAllUser = (clientId: string) =>
  prismaClient.user
    .findMany({
      where: {
        clientId,
      },
    })
    .then(A.map(ZUser.parse));

const createUser = (createParam: TUserCreate) =>
  prismaClient.user
    .create({
      data: createParam,
    })
    .then(ZUser.parse);

const _getUserByEmail = (email: string, clientId: string) =>
  prismaClient.user.findFirst({
    where: {
      email,
      clientId,
    },
  });

const getUserByEmail = (email: string, clientId: string) =>
  _getUserByEmail(email, clientId);

const getUserByEmailSensitive = (email: string, clientId: string) =>
  _getUserByEmail(email, clientId)
    .then(getOrThrowNotFound(ENTITIES.user, RESOURCES.database))
    .then(ZUserSensitive.parse);

const userServices = {
  getAllUser,
  createUser,
  getUserByEmail,
  getUserByEmailSensitive,
};

export default userServices;
