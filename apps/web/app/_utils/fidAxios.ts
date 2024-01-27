"use client";
import axios from "axios";
import { ERROR_CODES, TBackendResponse } from "@repo/validator";
import { R } from "@mobily/ts-belt";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { API_URL } from "../_constants/appEnv";

const fidAxios = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 5000,
});

fidAxios.interceptors.request.use(
  (config) => {
    config.headers["Accept"] = "application/json";
    config.headers["Content-Type"] = config.headers["Content-Type"]
      ? config.headers["Content-Type"]
      : "application/json";
    if (hasCookie("accessToken")) {
      config.headers["Authorization"] = `Bearer ${getCookie("accessToken")}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

type RefreshBackendResponse = TBackendResponse<{
  accessToken: string;
}>;

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
    if (
      error.response?.data?.code === ERROR_CODES.JWT_EXPIRED &&
      originalRequest._retryCount <= 3
    ) {
      originalRequest._retryCount += 1;
      const RResponse = await R.fromPromise(
        fidAxios.post<RefreshBackendResponse>("/users/refresh-token"),
      );
      if (R.isError(RResponse)) {
        return Promise.reject(error);
      }
      const response = R.toNullable(RResponse)!;
      if (response.data?.data.accessToken) {
        setCookie("accessToken", response.data.data.accessToken);
      }
      return Promise.resolve();
    }
    return Promise.reject(error);
  },
);

fidAxios.defaults.withCredentials = true;

export default fidAxios;
