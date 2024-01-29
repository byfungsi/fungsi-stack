import request from "supertest";
// import { describe, test, expect } from "vitest";
import { app } from "../../../../core/app";
import HTTP_CODES from "../../../../constants/httpCodes";

const ROUTE_PATH = "/api/auth/intent";
describe("Intent Route", () => {
  test("SUCCESS", async () => {
    const res = await request(app).post(ROUTE_PATH);
    expect(res.status).toBe(HTTP_CODES.SUCCESS);
    expect(res.headers["set-cookie"]).toEqual([
      expect.stringContaining("clientSecret"),
    ]);
  });
});
