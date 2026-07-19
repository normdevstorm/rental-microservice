import Axios from "axios";
import localStorageService from "./localStorageService";
import { ADDRESS_API_URL, API_URL } from "../const/path";
import { authRepository } from "../../data/auth/repository/auth_reponsitory";
import { LoginResponse } from "../../data/auth/model/response/login_response";

export const axiosInstance = Axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: API_URL || process.env.BE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const axiosAddressInstance = Axios.create({
  timeout: 3 * 60 * 1000,
  baseURL: ADDRESS_API_URL || process.env.ADDRESS_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (
      ["/auth/signin", "/auth/signup"].every((url) => {
        return url !== config.url;
      })
    ) {
      const token = localStorageService.getLocalStorage("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const localLogout = async () => {
  await authRepository.logout(true);
  window.location.href = "/login";
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        [
          "/auth/signin",
          "/auth/signup",
          "/auth/logoutone",
          "/auth/refresh",
        ].every((url) => {
          return url !== originalRequest.url;
        })
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken =
          localStorageService.getLocalStorage("refreshToken");

        try {
          const res = await Axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
            deviceId: localStorageService.getLocalStorage("fcmToken"),
          });

          const data = res.data.data as LoginResponse;
          localStorageService.setLocalStorage("accessToken", data.token);
          localStorageService.setLocalStorage(
            "refreshToken",
            data.refreshToken
          );

          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          processQueue(null, data.token);

          return axiosInstance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else if (
        ["/auth/logoutone", "/auth/refresh"].some((url) => {
          return url === originalRequest.url;
        })
      ) {
        // processQueue(error, null);
        localLogout();
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  }
);

export const sendGet = (url: string, params?: any) =>
  axiosInstance.get(url, { params }).then((res) => res?.data);

export const sendPost = (url: string, params?: any, queryParams?: any) =>
  axiosInstance
    .post(url, params, { params: queryParams })
    .then((res) => res?.data);

export const sendPut = (url: string, params?: any) =>
  axiosInstance.put(url, params).then((res) => res?.data);

export const sendPatch = (url: string, params?: any) =>
  axiosInstance.patch(url, params).then((res) => res?.data);

export const sendDelete = (url: string, params?: any) =>
  axiosInstance.delete(url, { data: params }).then((res) => res?.data);

export const sendPostS3 = (url: string, params?: any) => {
  Axios.defaults.headers.common.Authorization = undefined;
  return Axios.post(url, params).then((res) => res?.data);
};

export const sendPostDRM = (url: string, params?: any) => {
  Axios.defaults.headers.common.Authorization = undefined;
  return Axios.post(url, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res?.data);
};
