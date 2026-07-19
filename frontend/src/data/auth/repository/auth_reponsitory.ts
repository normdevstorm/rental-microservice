import localStorageService from "../../../common/services/localStorageService";
import { clearPersistedState } from "../../../store";
import { authApi } from "../api/auth_api";
import type { LoginRequest } from "../model/request/login_request";
import { SignUpRequest } from "../model/request/signup_request";
import { LoginResponse } from "../model/response/login_response";
import { SignUpResponse } from "../model/response/singup_response";

export class AuthRepository {
  private static instance: AuthRepository;

  public static getInstance(): AuthRepository {
    if (!AuthRepository.instance) {
      AuthRepository.instance = new AuthRepository();
    }
    return AuthRepository.instance;
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await authApi.login(loginRequest);
      if (response === null) {
        throw new Error("Login failed");
      }
      localStorageService.setLocalStorage("accessToken", response.data.token);
      localStorageService.setLocalStorage(
        "refreshToken",
        response.data.refreshToken
      );
      return response.data;
    } catch (error) {
      console.error("AuthRepository login error:", error);
      throw error;
    }
  }

  async logout(isLocalLogOut?: boolean): Promise<void> {
    if (!isLocalLogOut) {
      await authApi.logout();
    }
    localStorageService.clearKey("accessToken");
    localStorageService.clearKey("refreshToken");
    clearPersistedState();
    return Promise.resolve();
  }

  async refreshToken(refresh_token: string): Promise<LoginResponse | null> {
    try {
      const response = await authApi.refreshToken(refresh_token);
      if (response?.data !== null) {
        localStorage.setItem("accessToken", response!.data.token);
        localStorage.setItem("refreshToken", response!.data.refreshToken);
        return response!.data;
      }
      return null;
    } catch (error) {
      console.error("AuthRepositoryImpl refreshToken error:", error);
      return null;
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await authApi.validateToken();
      return response?.data ?? false;
    } catch (error) {
      console.error("AuthRepositoryImpl validateToken error:", error);
      return false;
    }
  }

  async signup(signupRequest: SignUpRequest): Promise<SignUpResponse> {
    try {
      const response = await authApi.signup(signupRequest);
      if (response === null) {
        throw new Error("Signup failed");
      }

      // Backend trả envelope: { success, message, code, data }
      const { success, message, code } = response;

      if (!success) {
        const err = new Error(message || "Signup failed");
        // optional: gán code để UI có thể phân nhánh theo mã lỗi (VD: EMAIL_EXISTS)
        (err as any).code = code;
        throw err;
      }

      // Thành công: trả message cho UI hiện toast rồi navigate("/login")
      return { message: message || "Đăng ký thành công. Vui lòng đăng nhập." };
    } catch (error) {
      console.error("AuthRepository signup error:", error);
      throw error;
    }
  }
}

export const authRepository = AuthRepository.getInstance();
