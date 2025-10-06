import Axios from "axios";
import localStorageService from "./localStorageService";
import { ADDRESS_API_URL, API_URL } from "../const/path";
import { authRepository } from "../../data/auth/repository/auth_reponsitory";
import { log } from "console";
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
        return url != config.url;
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

const logout = async () => {
  await authRepository.logout();
  window.location.href = "/login";
};

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error: any) => {
//     const originalConfig = error.config;

//     if (error.response?.status !== 401) {
//       return Promise.reject(error?.response?.data);
//     } else {
//       if (
//         [
//           "/auth/signin",
//           "/auth/signup",
//           "/auth/logoutone",
//           "/auth/refresh",
//         ].every((url) => {
//           return url != originalConfig.url;
//         })
//       ) {
//         // {logout();}
//         ///TODO: handle this later after refresh token works properly
//         const refreshToken =
//           localStorageService.getLocalStorage("refreshToken");
//         if (refreshToken === undefined) {
//           return error;
//         }
//         // Axios.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;
//         return Axios.post(`${API_URL}/auth/refresh`, {
//           refreshToken: refreshToken,
//           deviceId: localStorageService.getLocalStorage("fcmToken"),
//         }).then((res) => {
//           if (res.status === 200) {
//             const data = res.data.data as LoginResponse;
//             localStorageService.setLocalStorage("accessToken", data.token);
//             localStorageService.setLocalStorage(
//               "refreshToken",
//               data.refreshToken
//             );
//             originalConfig.headers.Authorization = `Bearer ${data.token}`;
//             return axiosInstance(originalConfig);
//           }
//           logout();
//           return error;
//         });
//       }
//     }
//   }
// );

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

      const refreshToken = localStorageService.getLocalStorage("refreshToken");

      try {
        const res = await Axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
          deviceId: localStorageService.getLocalStorage("fcmToken"),
        });

        const data = res.data.data as LoginResponse;
        localStorageService.setLocalStorage("accessToken", data.token);
        localStorageService.setLocalStorage("refreshToken", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        processQueue(null, data.token);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
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
