import request from "supertest";
import {
  ERROR_CODES,
  ROUTES,
  TCreateClientRequest,
  ZCreateClientResponse,
  ZLoginResponse,
  withBaseUrl,
} from "@repo/validator";
import { app } from "../../../../core/app";
import { TEST_EMAIL, TEST_PASSWORD } from "../../../../__test__/testConstants";
import HTTP_CODES from "../../../../constants/httpCodes";

describe("create client", () => {
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

  test("success", async () => {
    const body: TCreateClientRequest = {
      name: "New Client",
    };
    const res = await loggedinReq
      .post(withBaseUrl(ROUTES.administrationClients))
      .send(body);
    expect(res.status).toBe(HTTP_CODES.SUCCESS);
    expect(ZCreateClientResponse.safeParse(res.body).success).toBe(true);
  });

  test("body error", async () => {
    const body = {};
    const res = await loggedinReq
      .post(withBaseUrl(ROUTES.administrationClients))
      .send(body);

    expect(res.status).toBe(HTTP_CODES.BAD_REQUEST);
    expect(res.body).toStrictEqual(
      expect.objectContaining({
        code: ERROR_CODES.INVALID_BODY,
      }),
    );
  });
});
