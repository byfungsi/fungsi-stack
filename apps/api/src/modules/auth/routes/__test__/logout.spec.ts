import {
  ERROR_CODES,
  ROUTES,
  TCreateUserRequest,
  TLogoutRequest,
  ZLoginResponse,
  withBaseUrl,
} from "@repo/validator";
import request from "supertest";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("Logout", () => {
  const RoutePath = withBaseUrl(ROUTES.logout);
  let reqIntent: request.Agent;
  beforeAll(async () => {
    reqIntent = request.agent(app);
    await reqIntent.post(withBaseUrl(ROUTES.intent));
  });

  test("logout flow success", async () => {
    const createUser: TCreateUserRequest = {
      email: "mail222@mail.com",
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
    const resV1 = await reqIntent.post(withBaseUrl(ROUTES.verify)).set({
      Authorization: `Bearer ${loginData.data.accessToken}`,
    });

    expect(resV1.status).toBe(HTTP_CODES.SUCCESS);
    const body: TLogoutRequest = {
      userId: loginData.data.user.id,
    };
    const res = await reqIntent
      .post(RoutePath)
      .send(body)
      .set({
        Authorization: `Bearer ${loginData.data.accessToken}`,
      });

    expect(res.status).toBe(HTTP_CODES.SUCCESS);

    const resV2 = await reqIntent.post(withBaseUrl(ROUTES.verify)).set({
      Authorization: `Bearer ${loginData.data.accessToken}`,
    });

    expect(resV2.status).toBe(HTTP_CODES.NOT_FOUND);

    // re access logout route
    const res2 = await reqIntent
      .post(RoutePath)
      .send(body)
      .set({
        Authorization: `Bearer ${loginData.data.accessToken}`,
      });

    expect(res2.status).toBe(HTTP_CODES.NOT_FOUND);
    expect(res2.body).toStrictEqual(
      expect.objectContaining({ code: ERROR_CODES.ACCESS_TOKEN_NOT_FOUND }),
    );
  });
});
