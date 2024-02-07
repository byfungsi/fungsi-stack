import request from "supertest";
import {
  ROUTES,
  ZGetClientsResponse,
  ZLoginResponse,
  withBaseUrl,
} from "@repo/validator";
import { app } from "../../../../core/app";
import { TEST_EMAIL, TEST_PASSWORD } from "../../../../__test__/testConstants";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("getClient", () => {
  let loggedinReq: request.Agent;

  beforeAll(async () => {
    loggedinReq = request.agent(app);
    await loggedinReq.post(withBaseUrl(ROUTES.intent));
    const res = await loggedinReq
      .post(withBaseUrl(ROUTES.login))
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD });
    const loginBody = ZLoginResponse.parse(res.body);
    const token = loginBody.data!.accessToken;
    loggedinReq.set("Authorization", `Bearer ${token}`);
  });

  const RoutePath = withBaseUrl(ROUTES.administrationClients);
  test("success", async () => {
    const res = await loggedinReq.get(RoutePath);

    expect(res.status).toBe(HTTP_CODES.SUCCESS);
    expect(ZGetClientsResponse.safeParse(res.body).success).toBe(true);
  });
});
