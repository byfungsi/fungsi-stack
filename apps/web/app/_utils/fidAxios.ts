"use client";
import axios from "axios";
import { ERROR_CODES, ROUTES, TRefreshTokenResponse } from "@repo/validator";
import { R } from "@mobily/ts-belt";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import { API_URL } from "../_constants/appEnv";
import { TOKEN_KEY } from "../_constants/keys";
import { setServerToken } from "../_actions/setServerToken";
import { deleteServerToken } from "../_actions/deleteServerToken";

const fidAxios = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 5000,
});

fidAxios.interceptors.request.use(
  async (config) => {
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = config.headers["Content-Type"]
      ? config.headers["Content-Type"]
      : "application/json";

    if (hasCookie(TOKEN_KEY)) {
      config.headers["Authorization"] = `Bearer ${getCookie(TOKEN_KEY)}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

fidAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    originalRequest._retryCount = originalRequest._retryCount
      ? originalRequest._retryCount
      : 0;
    if (originalRequest._retryCount >= 3) {
      window.location.href = "/login";
      deleteCookie(TOKEN_KEY);
      deleteServerToken();
      return;
    }
    if (error.response?.data?.code === ERROR_CODES.ACCESS_TOKEN_EXPIRED) {
      originalRequest._retryCount += 1;
      const RResponse = await R.fromPromise(
        fidAxios.post<TRefreshTokenResponse>(ROUTES.refresh),
      );
      if (R.isError(RResponse)) {
        return fidAxios(originalRequest);
      }
      const response = R.toNullable(RResponse)!;
      if (response.data?.data.accessToken) {
        setCookie(TOKEN_KEY, response.data.data.accessToken);
        setServerToken(response.data.data.accessToken);
      }
      return fidAxios(originalRequest);
    }

    return Promise.reject(error);
  },
);

fidAxios.defaults.withCredentials = true;

export default fidAxios;
