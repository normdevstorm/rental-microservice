import { useEffect, useState } from "react";
import type { UserResponse } from "../../../../data/user/model/response/user_response";
import { userRepository } from "../../../../data/user/repository/user_repository";
type FormState = {
  name?: string;
  identityCard?: string;
  phone?: string;
  email: string;
  licenseNumber?: string;
};

const emptyForm: FormState = {
  name: undefined,
  identityCard: undefined,
  phone: undefined,
  email: "",
  licenseNumber: undefined,
};

const RenterForm = ({
  form,
  error,
  loading,
  handleChange,
}: {
  form: FormState;
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  // const [form, setForm] = useState<FormState>(emptyForm);

  return (
    <form className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-full">
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <span className="text-red-700 font-medium text-sm">{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
          <span className="text-emerald-700 font-medium text-sm">
            Đang tải thông tin...
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-emerald-700 mb-2">
            Họ và tên<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-emerald-700 mb-2">
            CMND/CCCD<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <input
              type="number"
              name="identityCard"
              value={form.identityCard}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="012345678901"
              inputMode="numeric"
              autoComplete="off"
              required={true}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-emerald-700 mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              type="number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="09xxxxxxxx"
              autoComplete="tel"
              required={true}
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-emerald-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="example@email.com"
              autoComplete="email"
              required={true}
              disabled={true}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-emerald-700 mb-2">
            Giấy phép lái xe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              placeholder="Số giấy phép lái xe"
              autoComplete="off"
              required={true}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default RenterForm;
