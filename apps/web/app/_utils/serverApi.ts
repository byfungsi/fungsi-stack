import { getCookie, hasCookie, setCookie } from "cookies-next";
import ky, { HTTPError } from "ky";
import {
  ERROR_CODES,
  ROUTES,
  TRefreshTokenResponse,
  removeBaseSlash,
} from "@repo/validator";
import { API_URL } from "../_constants/appEnv";
import { TOKEN_KEY } from "../_constants/keys";
import { setServerToken } from "../_actions/setServerToken";
/* use only on server */
export const serverApi = ky.extend({
  prefixUrl: `${API_URL}/api`,
  timeout: 5000,
  retry: 3,
  hooks: {
    beforeRequest: [
      (config) => {
        if (hasCookie(TOKEN_KEY)) {
          config.headers.set("Authorization", `Bearer ${getCookie(TOKEN_KEY)}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
        if (error.response.headers.get("Content-Type") === "application/json") {
          const body = await error.response.json();
          error.message = body.message;
        }
        return error;
      },
    ],
    beforeRetry: [
      async (opt) => {
        if (
          opt.error instanceof HTTPError &&
          opt.error.response.status === 401
        ) {
          const json = await opt.error.response.json();
          if (json.code === ERROR_CODES.ACCESS_TOKEN_EXPIRED) {
            const refresh = await ky
              .post(removeBaseSlash(ROUTES.refresh))
              .json<TRefreshTokenResponse>();
            setCookie(TOKEN_KEY, refresh.data.accessToken);
            setServerToken(refresh.data.accessToken);
          }
        }
      },
    ],
  },
});
