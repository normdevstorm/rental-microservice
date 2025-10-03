import { sendGet, sendPatch, sendPost } from "../common/services/axios";

// eslint-disable-next-line import/prefer-default-export
export const login = (payload: any) => sendPost("users/login", payload);
export const requestOtp = (payload: any) =>
  sendPost("/auth/local/signin-otp", payload);
export const loginWithSocial = (payload: any) =>
  sendPost("/auth/single-sign-on", payload);
export const loginWithOTP = (payload: any) =>
  sendPatch("/auth/local/verify-otp", payload);
export const signinOrSignup = (payload: any) =>
  sendPost("/auth/website/onboard", payload);
export const addInviteCode = (payload: any) =>
  sendPost("/users/add-invite-code", payload);
export const signUp = (payload: any) =>
  sendPost("/v1/app/auth/signup", payload);
export const signInWithGoogle = () => sendGet("auth/google");
export const loginOnboardWithPass = (payload: any) =>
  sendPost("/auth/website/set-password-onboard", payload);
export const sendVerifyEmail = () => sendPost("/users/send-mail-verify");
export const sendVerifyEmailSuccess = (payload: any) =>
  sendPost("/users/verify-user/accept", payload);

export const logout = () => sendGet("/users/me/signout");
