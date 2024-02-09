import { Prisma } from "@repo/database";
import { TEntitiesKey } from "../constants/entities";
import { TResourcesKey } from "../constants/resources";
import { NotFoundError } from "../core/errors/NotFoundError";

export const catchPrismaNotFound = (
  entities: TEntitiesKey,
  resources: TResourcesKey,
) => {
  return (err: Error) => {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2001"
    ) {
      throw new NotFoundError(entities, resources);
    }
    throw err;
  };
};
