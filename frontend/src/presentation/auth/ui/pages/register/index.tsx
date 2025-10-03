import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import EyeToggleButton from "../../components/EyeToggleButton";
import { useGlobalAlert } from "../../../../../common/components/AlertDialog/AlertProvider";
import { authRepository } from "../../../../../data/auth/repository/auth_reponsitory";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../../../common/types/enums/enums";
import { SignUpRequest } from "../../../../../data/auth/model/request/signup_request";
import { emailVerificationRepository } from "../../../../../data/email/repository/emailVerificationRepository";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

const RegisterPage = () => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>({
    defaultValues: { acceptTerms: false },
  });

  const alertDialog = useGlobalAlert();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("password");

  
const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
  // try {
  //   const { confirmPassword, ...payload } = data; // không gửi confirmPassword
  //   const signupRequest : SignUpRequest = {      email: payload.email,
  //     name: payload.name,
  //     password: payload.password,
  //     role: [UserRole.RENTER]};
  //   const res = await authRepository.signup(signupRequest); // <- gọi repository

    
  //   alertDialog.notify(res.message);
  //   navigate("/login", { state: { email: payload.email } });
  // } catch (error: any) {
  //   console.log("error", errors);
  //   alertDialog.error(error?.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
  // }

  
if ("confirmPassword" in data && data.password !== data.confirmPassword) {
    alertDialog.error("Mật khẩu nhập lại không khớp.");
    return;
  }

  // 1) Build draft từ dữ liệu form (KHÔNG gửi confirmPassword lên BE)
  const { confirmPassword, ...payload } = data;
  const signupDraft: SignUpRequest & { confirmPassword?: string } = {
    email: payload.email.trim(),
    name: payload.name.trim(),
    password: payload.password,
    role: [UserRole.RENTER], // tùy theo yêu cầu của bạn
    // ... thêm các field khác nếu SignUpRequest của bạn có (phone, address, ...)
    ...(confirmPassword ? { confirmPassword } : {}),
  };

  try {
    // 2) Lưu draft vào sessionStorage
    sessionStorage.setItem("signupDraft", JSON.stringify(signupDraft));

    // 3) Gửi mã xác minh tới email trong draft
    await emailVerificationRepository.send(signupDraft.email);

    // 4) Thông báo & điều hướng sang trang verify
    alertDialog.notify(`Đã gửi mã xác minh tới ${signupDraft.email}`);
    navigate("/verify-email");
  } catch (error: any) {
    console.error("Signup draft/send code error:", error);
    alertDialog.error(
      error?.message ?? "Không thể gửi mã xác minh. Vui lòng thử lại."
    );
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-xl">
        {/* decorative green glows */}
        <div className="pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-green-200/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-emerald-200/60 blur-2xl" />

        <div className="relative rounded-2xl bg-white/90 backdrop-blur p-8 shadow-xl ring-1 ring-black/5">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
              {/* user-plus icon (inline SVG) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden
              >
                <path d="M15 14a4 4 0 10-6 0C6.239 14 4 16.239 4 19a1 1 0 001 1h10a1 1 0 001-1c0-2.761-2.239-5-5-5zm-3-2a2 2 0 110-4 2 2 0 010 4z" />
                <path d="M19 8h-2V6a1 1 0 10-2 0v2h-2a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Join us in a few easy steps.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"> */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
              {/* </div> */}
            </div>

            <div>
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
                placeholder="you@example.com"
                {...register("email", {
                  required: true,
                  pattern: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                })}
                aria-invalid={!!errors?.email}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
              />
              {errors?.email && (
                <p className="mt-1 text-xs text-red-600">
                  Please enter a valid email
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
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password", { required: true, minLength: 8 })}
                  aria-invalid={!!errors?.password}
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
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: true,
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                  aria-invalid={!!errors?.confirmPassword}
                  className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-10 text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500"
                />
                <EyeToggleButton
                  isVisible={showConfirm}
                  onToggle={() => setShowConfirm((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3"
                  ariaLabelShow="Show password"
                  ariaLabelHide="Hide password"
                  size={20}
                />
              </div>
              {errors?.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {typeof errors.confirmPassword.message === "string"
                    ? errors.confirmPassword.message
                    : "Please confirm your password"}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="acceptTerms"
                type="checkbox"
                {...register("acceptTerms", { required: true })}
                aria-invalid={!!errors?.acceptTerms}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the
                <a
                  href="#"
                  className="mx-1 font-medium text-green-700 hover:text-green-800 underline"
                >
                  Terms
                </a>
                and
                <a
                  href="#"
                  className="ml-1 font-medium text-green-700 hover:text-green-800 underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors?.acceptTerms && (
              <p className="-mt-2 text-xs text-red-600">
                You must accept the terms
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-green-500/20 transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 active:bg-green-800"
              >
                Create account
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <a
              href="/login"
              className="ml-1 font-medium text-green-700 hover:text-green-800 underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
