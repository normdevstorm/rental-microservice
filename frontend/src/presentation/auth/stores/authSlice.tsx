import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../store/index";
import { UserResponse } from "../../../data/user/model/response/user_response";
type Role = {
  action: string;
  code: string;
  controller: string;
  id: number;
  title: string;
};
export interface AuthState {
  /**
   * User has rights to use the app
   */
  activated: boolean;
  /**
   * If this is `true` then the user is existed in our system, doesnt mean user has rights to use the app
   */
  authenticated: boolean;
  authenticating: boolean;
  loginMethod: string;
  user?: UserResponse;
  permissions?: string[];
  role?: Role[];
  handleLogout?: boolean; // check is user click logout
  /**
   * Token for reset-password, change-password, stuffs like that
   */
  temporaryToken?: string;
}

const initialAuthState: AuthState = {
  activated: false,
  authenticated: false,
  authenticating: true,
  loginMethod: "",
  user: undefined,
  permissions: undefined,
  handleLogout: false,
  role: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setAuthenticated: (state, data: PayloadAction<{ activated: boolean }>) => {
      state.authenticated = true;
      state.activated = data.payload.activated;
    },
    setAuthenticating: (state, data: any) => {
      state.authenticating = data.payload;
    },
    logout: (state) => {
      state.authenticated = false;
      state.user = undefined;
      state.permissions = undefined;
      state.role = undefined;
      state.handleLogout = true;
    },
    setProfile: (state, data: PayloadAction<{ user: UserResponse }>) => {
      state.user = data?.payload?.user;
      // state.permissions = data?.payload?.permissions;
      // state.role = data?.payload?.role;
    },
    setLoginMethod: (state, data: any) => {
      state.loginMethod = data.payload;
    },
    setPermission: (state, data: any) => {
      state.permissions = data?.payload;
    },
    setTemporaryToken: (state, data: PayloadAction<string | undefined>) => {
      state.temporaryToken = data.payload;
    },
  },
});

export const getTemporaryToken = (state: RootState) =>
  state.auth.temporaryToken;

export const {
  setAuthenticated,
  logout,
  setAuthenticating,
  setProfile,
  setLoginMethod,
  setPermission,
  setTemporaryToken,
} = authSlice.actions;
export default authSlice.reducer;
