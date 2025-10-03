import React, { useState, useRef, useEffect } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

import { emailVerificationRepository } from "../../../../../data/email/repository/emailVerificationRepository";
import { authRepository } from "../../../../../data/auth/repository/auth_reponsitory";
import { useGlobalAlert } from "../../../../../common/components/AlertDialog/AlertProvider";
import { UserRole } from "../../../../../common/types/enums/enums";
import { SignUpRequest } from "../../../../../data/auth/model/request/signup_request";

type SignupDraft = SignUpRequest & {
  confirmPassword?: string;
};

const EmailVerificationCode = (): JSX.Element => {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [countdownTarget, setCountdownTarget] = useState(Date.now() + 180000);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const alertDialog = useGlobalAlert();

  useEffect(() => {
    const raw = sessionStorage.getItem("signupDraft");
    if (!raw) {
      navigate("/signup");
      return;
    }

    const draft = JSON.parse(raw) as SignupDraft;
    if (!draft?.email) {
      navigate("/signup");
      return;
    }

    setEmail(draft.email);
  }, [navigate]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      void handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text") ?? "";
    const digits = text.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length) {
      e.preventDefault();
      const filled = Array(6).fill("");
      for (let i = 0; i < digits.length; i++) filled[i] = digits[i];
      setCode(filled);
      const nextIndex = Math.min(digits.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    setMsg(null);
    setErr(null);

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setErr("Vui lòng nhập đủ 6 chữ số.");
      return;
    }
    if (!email) {
      setErr("Thiếu email từ phiên đăng ký. Vui lòng đăng ký lại.");
      return;
    }

    setLoading(true);
    try {
      await emailVerificationRepository.verify({ email, code: fullCode });
      setMsg("Xác thực thành công.");

      const raw = sessionStorage.getItem("signupDraft");
      if (!raw) {
        throw new Error("Thiếu thông tin đăng ký. Vui lòng thực hiện lại bước đăng ký.");
      }

      const draft = JSON.parse(raw) as SignupDraft;
      if (!draft?.email) {
        throw new Error("Thiếu email trong phiên đăng ký. Vui lòng đăng ký lại.");
      }

      const { confirmPassword, ...payload } = draft;
      const signupRequest: SignUpRequest = {
        ...payload,
        email: payload.email.trim(),
        ...(payload as any).name ? { name: (payload as any).name.trim() } : {},
        role:
          Array.isArray((payload as any).role) && (payload as any).role.length
            ? (payload as any).role
            : [UserRole.RENTER],
      };

      const res = await authRepository.signup(signupRequest);
      sessionStorage.removeItem("signupDraft");
      alertDialog.notify(res.message ?? "Đăng ký thành công!");
      navigate("/login", { state: { email: signupRequest.email } });
    } catch (e: any) {
      const m =
        e?.response?.data?.message ??
        e?.message ??
        "Thao tác thất bại. Vui lòng thử lại.";
      setErr(m);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMsg(null);
    setErr(null);

    if (!email) {
      setErr("Thiếu email để gửi lại mã. Vui lòng đăng ký lại.");
      return;
    }

    setLoading(true);
    try {
      await emailVerificationRepository.send(email);
      setMsg(`Đã gửi mã xác minh tới ${email}.`);
      setCountdownTarget(Date.now() + 180000); // reset countdown
    } catch (e: any) {
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Gửi mã xác minh thất bại.";
      alertDialog.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderer = ({ minutes, seconds, completed }: any) => {
    if (completed) {
      return <span className="text-red-500">Hết thời gian</span>;
    } else {
      return (
        <span className="text-green-600">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };

  const isVerifyDisabled = loading || code.some((c) => c === "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 px-4 py-12">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-green-300">
        <h2 className="text-2xl font-bold text-green-700 mb-2">
          Xác thực email
        </h2>
        <p className="text-gray-600 mb-4">
          Nhập mã gồm 6 chữ số đã gửi đến email của bạn
          {email ? ` (${email})` : ""}.
        </p>

        <div className="flex justify-between gap-2 mb-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        {msg && <div className="mb-3 text-green-600 text-sm">{msg}</div>}
        {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}

        <button
          onClick={handleVerify}
          disabled={isVerifyDisabled}
          className={`w-full text-white py-2 rounded-md transition mb-4 ${
            isVerifyDisabled
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Đang xử lý..." : "Xác thực"}
        </button>

        <div className="flex justify-between items-center text-sm text-gray-700">
          <div>
            Thời gian còn lại:{" "}
            <Countdown
              date={countdownTarget}
              renderer={renderer}
            />
          </div>
          <button
            onClick={handleResend}
            disabled={loading}
            className={`ml-4 ${
              loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-green-600 hover:underline"
            }`}
          >
            Gửi lại mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationCode;