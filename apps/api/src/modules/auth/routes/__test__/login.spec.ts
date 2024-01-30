import request from "supertest";
import { ERROR_CODES, TCreateUserRequest, TUserLogin } from "@repo/validator";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";
import { ROUTES, withBaseUrl } from "../../../../constants/routes";

const RoutePath = withBaseUrl(ROUTES.login);
let reqIntent: request.Agent;

describe("Login Route", () => {
  beforeAll(async () => {
    reqIntent = request.agent(app);
    await reqIntent.post(withBaseUrl(ROUTES.intent));
  });
  test("error when invalid body", async () => {
    const res = await reqIntent.post(RoutePath);

    expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_BODY,
      }),
    );
  });

  test("error when email not found", async () => {
    const body: TUserLogin = {
      email: "email1231312@mail.com",
      password: "1asda1sdnaj",
    };
    const res = await reqIntent.post(RoutePath).send(body);
    expect(res.status).toBe(HTTP_CODES.NOT_FOUND);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.DATA_NOT_FOUND_DB,
      }),
    );
  });

  describe("with user exist", () => {
    const EMAIL = "email123.com";
    const PASSWORD = "password123";
    const NAME = "name12312";
    beforeAll(async () => {
      const bodyCreate: TCreateUserRequest = {
        email: EMAIL,
        password: PASSWORD,
        name: NAME,
      };
      await reqIntent.post(withBaseUrl(ROUTES.user)).send(bodyCreate);
    });

    test("wrong password", async () => {
      const body: TUserLogin = {
        email: EMAIL,
        password: "WrongPASSSWWORD",
      };
      const res = await reqIntent.post(RoutePath).send(body);
      expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(res.body).toStrictEqual(
        expect.objectContaining({
          code: ERROR_CODES.WRONG_PASSWORD,
        }),
      );
    });

    test("success", async () => {
      const body: TUserLogin = {
        email: EMAIL,
        password: PASSWORD,
      };
      const res = await reqIntent.post(RoutePath).send(body);

      expect(res.status).toBe(HTTP_CODES.SUCCESS);
    });
  });
});
