import request from "supertest";
import { ERROR_CODES, TCreateUserRequest } from "@repo/validator";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";
import { MESSAGE } from "../../../../constants/message";

const RoutePath = "/api/users";
describe("create user route", () => {
  test("should error when accessed without client secret", async () => {
    const res = await request(app).post(RoutePath);
    expect(res.status).toBe(HTTP_CODES.NOT_FOUND);
  });

  describe("with Intent", () => {
    let reqIntent: request.Agent;
    beforeAll(async () => {
      reqIntent = request.agent(app);
      await reqIntent.post("/api/auth/intent");
    });

    test("should error on invalid body", async () => {
      const res = await reqIntent.post(RoutePath);

      expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
      expect(res.body).toStrictEqual(
        expect.objectContaining({ code: ERROR_CODES.INVALID_BODY }),
      );
    });

    test("should be success", async () => {
      const body: TCreateUserRequest = {
        name: "New user",
        email: "user new",
        password: "userPassword123!",
      };
      const res = await reqIntent.post(RoutePath).send(body);
      expect(res.status).toBe(HTTP_CODES.SUCCESS);
    });

    test("should handle unique email", async () => {
      const body: TCreateUserRequest = {
        name: "New user",
        email: "user new",
        password: "userPassword123!",
      };
      await reqIntent.post(RoutePath).send(body);
      const res2 = await reqIntent.post(RoutePath).send(body);
      expect(res2.status).toBe(HTTP_CODES.BAD_REQUEST);
      expect(res2.body).toStrictEqual(
        expect.objectContaining({
          code: ERROR_CODES.UNIQUE_CONSTRAINT,
          message: MESSAGE.EMAIL_TAKEN,
        }),
      );
    });
  });
});
