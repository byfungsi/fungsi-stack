import {
  ERROR_CODES,
  ROUTES,
  TCreateUserRequest,
  ZLoginResponse,
  ZRefreshTokenResponse,
  withBaseUrl,
} from "@repo/validator";
import { vi } from "vitest";
import dayjs from "dayjs";
import request from "supertest";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("Refreshtoken", () => {
  const RoutePath = withBaseUrl(ROUTES.refresh);
  test("no token found", async () => {
    const res = await request(app).post(RoutePath);

    expect(res.status).toBe(HTTP_CODES.NOT_FOUND);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.MISSING_REFRESH_TOKEN,
      }),
    );
  });

  describe("expiration", () => {
    const EMAIL = "email123.com";
    const PASSWORD = "password123";
    const NAME = "name12312";
    let loggedinReq: request.Agent;
    let token: string;
    beforeAll(async () => {
      const bodyCreate: TCreateUserRequest = {
        email: EMAIL,
        password: PASSWORD,
        name: NAME,
      };
      const reqIntent = request.agent(app);
      await reqIntent.post(withBaseUrl(ROUTES.intent));
      await reqIntent
        .post(withBaseUrl(ROUTES.administrationUsers))
        .send(bodyCreate);
    });

    beforeEach(async () => {
      loggedinReq = request.agent(app);
      await loggedinReq.post(withBaseUrl(ROUTES.intent));
      const res = await loggedinReq
        .post(withBaseUrl(ROUTES.login))
        .send({ email: EMAIL, password: PASSWORD });
      const loginBody = ZLoginResponse.parse(res.body);
      token = loginBody.data!.accessToken;
    });

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("expired token", async () => {
      vi.setSystemTime(dayjs().add(3, "month").toDate());
      const res = await loggedinReq
        .post(RoutePath)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(HTTP_CODES.UNAUTHORIZED);
      expect(res.body).toStrictEqual(
        expect.objectContaining({
          code: ERROR_CODES.REFRESH_TOKEN_EXPIRED,
        }),
      );
    });

    test("success", async () => {
      const res = await loggedinReq
        .post(RoutePath)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(HTTP_CODES.SUCCESS);
      expect(ZRefreshTokenResponse.safeParse(res.body).success).toBe(true);
    });
  });
});
