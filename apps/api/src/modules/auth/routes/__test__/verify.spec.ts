import {
  ERROR_CODES,
  ROUTES,
  TCreateUserRequest,
  ZLoginResponse,
  ZVerifyResponse,
  withBaseUrl,
} from "@repo/validator";
import { vi, describe, beforeAll, test, expect } from "vitest";
import dayjs from "dayjs";
import request from "supertest";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("Verify", () => {
  const RoutePath = withBaseUrl(ROUTES.verify);
  let reqIntent: request.Agent;
  beforeAll(async () => {
    reqIntent = request.agent(app);
    await reqIntent.post(withBaseUrl(ROUTES.intent));
  });

  test("success on correct token", async () => {
    const createUser: TCreateUserRequest = {
      email: "mail@mail.com",
      password: "Mail123@",
      name: "Mail kawan upin",
    };

    await reqIntent
      .post(withBaseUrl(ROUTES.administrationUsers))
      .send(createUser);
    const loginRes = await reqIntent
      .post(withBaseUrl(ROUTES.login))
      .send(createUser);
    const loginData = ZLoginResponse.parse(loginRes.body);
    const res = await reqIntent.post(RoutePath).set({
      Authorization: `Bearer ${loginData.data.accessToken}`,
    });

    expect(res.status).toBe(HTTP_CODES.SUCCESS);
    expect(res.headers["set-cookie"]).toEqual([
      expect.stringContaining("refreshToken"),
    ]);
    expect(ZVerifyResponse.safeParse(res.body).success).toBe(true);
  });

  test("error on random token", async () => {
    const createUser: TCreateUserRequest = {
      email: "mail@mail.com",
      password: "Mail123@",
      name: "Mail kawan upin",
    };

    await reqIntent
      .post(withBaseUrl(ROUTES.administrationUsers))
      .send(createUser);
    const res = await reqIntent.post(RoutePath).set({
      Authorization: `Bearer loh123131231321312391289`,
    });

    expect(res.status).toBe(HTTP_CODES.NOT_FOUND);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.ACCESS_TOKEN_NOT_FOUND,
      }),
    );
  });

  test("error without login flow", async () => {
    const res = await reqIntent.post(RoutePath);

    expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED);

    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.MISSING_AUTHENTICATION_BEARER,
      }),
    );
  });

  describe("expiration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });
    test("expired refresh token", async () => {
      const createUser: TCreateUserRequest = {
        email: "mail@mail.com",
        password: "Mail123@",
        name: "Mail kawan upin",
      };

      await reqIntent
        .post(withBaseUrl(ROUTES.administrationUsers))
        .send(createUser);
      const loginRes = await reqIntent
        .post(withBaseUrl(ROUTES.login))
        .send(createUser);
      const loginData = ZLoginResponse.parse(loginRes.body);
      vi.setSystemTime(dayjs().add(3, "week").toDate());
      const res = await reqIntent.post(RoutePath).set({
        Authorization: `Bearer ${loginData.data.accessToken}`,
      });

      expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(res.body).toStrictEqual(
        expect.objectContaining({
          code: ERROR_CODES.REFRESH_TOKEN_EXPIRED,
        }),
      );
    });
  });
});
