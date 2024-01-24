import { TUserCreate } from "@repo/validator";
import prismaClient from "../../../core/prismaClient";

const getAllUser = () => prismaClient.user.findMany();
const createUser = (createParam: TUserCreate) =>
  prismaClient.user.create({
    data: createParam,
  });

const getUserByEmail = (email: string) =>
  prismaClient.user.findFirst({
    where: {
      email,
    },
  });

const userServices = {
  getAllUser,
  createUser,
  getUserByEmail,
};

export default userServices;
