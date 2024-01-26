import { G, O } from "@mobily/ts-belt";
import { NotFoundError } from "../core/errors/NotFoundError";
import { TEntitiesKey } from "../constants/entities";
import { TResourcesKey } from "../constants/resources";

function handle<T>(entity: TEntitiesKey, resource: TResourcesKey, data: T) {
  if (G.isNullable(data)) {
    throw new NotFoundError(entity, resource);
  }
  return O.getExn(O.fromNullable(data));
}

function getOrThrowNotFound(
  entity: TEntitiesKey,
  resource: TResourcesKey,
): <T>(data: T) => Exclude<T, null | undefined>;
function getOrThrowNotFound<T>(
  entity: TEntitiesKey,
  resource: TResourcesKey,
  data: T,
): Exclude<T, null | undefined>;
function getOrThrowNotFound<T>(
  ...args: [TEntitiesKey, TResourcesKey] | [TEntitiesKey, TResourcesKey, T]
) {
  if (args.length === 2) {
    const [entity, resource] = args;
    return <T>(data: T): Exclude<T, null | undefined> =>
      handle(entity, resource, data);
  }
  const [entity, resource, data] = args;

  return handle(entity, resource, data);
}

export default getOrThrowNotFound;
