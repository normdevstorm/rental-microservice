import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import EyeToggleButton from "../../components/EyeToggleButton";
import { authRepository } from "../../../../../data/auth/repository/auth_reponsitory";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setAuthenticated, setProfile } from "../../../stores/authSlice";
import { userRepository } from "../../../../../data/user/repository/user_repository";
import { useGlobalAlert } from "../../../../../common/components/AlertDialog/AlertProvider";
import { UserResponse } from "../../../../../data/user/model/response/user_response";
import localStorageService from "../../../../../common/services/localStorageService";

type LoginInputs = {
  email: string;
  password: string;
  // email: string;
};

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInputs>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alertDialog = useGlobalAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    // const validateResult = await authRepository.validateToken();
    // setAuthenticated(validateResult);
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      /// TODO: call login api and set state for the app here, so that we would be able to get user info in everywhere
      const response = await authRepository.login({
        email: data.email,
        password: data.password,
        deviceId: localStorageService.getLocalStorage("fcmToken"),
      });

      const myProfile: UserResponse = await userRepository.getUserProfile();
      const token = response?.token;

      if (!!token) {
        dispatch(setAuthenticated({ activated: true }));
        dispatch(setProfile({ user: myProfile }));
        setIsAuthenticated(true);
      }

      alertDialog.notify("Login succeeded");

      // const user = await userRepository.getUserProfile();
      // if (!response) {
      //   throw new Error("Login failed");
      // }
      // const token = response?.accessToken;

      // if (token) {
      // localStorageService.setLocalStorage("accessToken", token);
      // dispatch(setAuthenticated({ activated: true }));
      // dispatch(setProfile({ user: user }));
      // navigate("/");
      // }
    } catch (error: any) {
      alertDialog.error(error?.response?.data?.message ?? "Login failed");
      console.log("error", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* soft decorative glows */}
        <div className="pointer-events-none absolute -top-10 -right-6 h-24 w-24 rounded-full bg-green-200/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-emerald-200/60 blur-2xl" />

        <div className="relative rounded-2xl bg-white/90 backdrop-blur p-8 shadow-xl ring-1 ring-black/5">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              {/* lock icon (inline SVG to avoid extra deps) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden
              >
                <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm3 8H9V6a3 3 0 016 0v3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back. Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="email"
                autoComplete="email"
                {...register("email", { required: true })}
                aria-invalid={!!errors?.email}
                placeholder="email"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none ring-0 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
              />
              {errors?.email && (
                <p className="mt-1 text-xs text-red-600">
                  Username is required
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: true })}
                  aria-invalid={!!errors?.password}
                  placeholder="••••••••"
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
                <EyeToggleButton
                  isVisible={showPassword}
                  onToggle={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3"
                  ariaLabelShow="Show password"
                  ariaLabelHide="Hide password"
                  size={20}
                />
              </div>
              {errors?.password && (
                <p className="mt-1 text-xs text-red-600">
                  Password is required
                </p>
              )}
            </div>

            {/* <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", { required: true })}
                aria-invalid={!!errors?.email}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none ring-0 transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
              />
              {errors?.email && (
                <p className="mt-1 text-xs text-red-600">Email is required</p>
              )}
            </div> */}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-green-500/20 transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 active:bg-green-800"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?
            <a
              href="/register"
              className="ml-1 font-medium text-green-700 hover:text-green-800 underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
