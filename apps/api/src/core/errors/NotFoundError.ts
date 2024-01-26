export class NotFoundError extends Error {
  entity: string;
  resource: string;

  constructor(entity: string, resource: string) {
    super(`${entity} Not Found`);
    this.name = "NotFoundError";
    this.entity = entity;
    this.resource = resource;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
