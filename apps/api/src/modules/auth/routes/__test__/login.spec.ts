import request from "supertest";
import {
  ERROR_CODES,
  TCreateUserRequest,
  TUserLogin,
  ZLoginResponse,
  ROUTES,
  withBaseUrl,
} from "@repo/validator";
import { vi, describe, beforeAll, test, expect } from "vitest";
import dayjs from "dayjs";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("Login Route", () => {
  const RoutePath = withBaseUrl(ROUTES.login);
  let reqIntent: request.Agent;
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
      await reqIntent
        .post(withBaseUrl(ROUTES.administrationUsers))
        .send(bodyCreate);
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
      expect(ZLoginResponse.safeParse(res.body).success).toBe(true);
      expect(res.headers["set-cookie"]).toEqual([
        expect.stringContaining("refreshToken"),
      ]);
    });
  });

  describe("Expiration", () => {
    const EMAIL = "email123.com";
    const PASSWORD = "password123";
    const NAME = "name12312";
    beforeAll(async () => {
      const bodyCreate: TCreateUserRequest = {
        email: EMAIL,
        password: PASSWORD,
        name: NAME,
      };
      await reqIntent
        .post(withBaseUrl(ROUTES.administrationUsers))
        .send(bodyCreate);
    });

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("access token expired after 5m", async () => {
      const body: TUserLogin = {
        email: EMAIL,
        password: PASSWORD,
      };
      const res = await reqIntent.post(RoutePath).send(body);
      const loginBody = ZLoginResponse.parse(res.body);

      const verify1 = await reqIntent.post(withBaseUrl(ROUTES.verify)).set({
        Authorization: `Bearer ${loginBody.data.accessToken}`,
      });
      expect(verify1.status).toBe(HTTP_CODES.SUCCESS);

      vi.setSystemTime(dayjs().add(10, "minute").toDate());

      const verify2 = await reqIntent.post(withBaseUrl(ROUTES.verify)).set({
        Authorization: `Bearer ${loginBody.data.accessToken}`,
      });
      expect(verify2.status).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(verify2.body).toStrictEqual(
        expect.objectContaining({
          code: ERROR_CODES.ACCESS_TOKEN_EXPIRED,
        }),
      );
    });
  });
});
