import BookingLayout from "../layout/BookingLayout";
import StepIndicator from "../components/StepIndicator";
import RenterForm from "../components/RenterForm";
import FormButtons from "../components/FormButtons";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { userRepository } from "../../../../data/user/repository/user_repository";
import { UserResponse } from "../../../../data/user/model/response/user_response";
import useAlert from "../../../../common/components/AlertDialog/useAlert";
import { useGlobalAlert } from "../../../../common/components/AlertDialog/AlertProvider";
import { CreateBookingRequest } from "../../../../data/booking/model/request/create_booking_request";
import { useAppSelector } from "../../../../store";

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

const RegisterItemPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const alertDialog = useGlobalAlert();
  const bookingDataState: CreateBookingRequest = useAppSelector(
    (state) => state.booking.bookingData
  ) as CreateBookingRequest;

  // Tải profile và fill vào form
  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // const res: UserResponse = await userRepository.getUserProfile();
        const res: UserResponse = await userRepository.getUserProfile();

        if (!isMounted) return;
        setForm({
          name: res?.name ?? "",
          identityCard: res?.identityCard ?? "",
          phone: res?.phone ?? "",
          email: res?.email ?? "",
          licenseNumber: res?.licenseNumber ?? "",
        });
      } catch (e) {
        if (!isMounted) return;
        console.error(e);
        setError("Không thể tải hồ sơ người dùng.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler chung cho tất cả input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onClickNext = async () => {
    // Kiểm tra các trường bắt buộc
    if (
      !form.name ||
      !form.identityCard ||
      !form.phone ||
      !form.email ||
      !form.licenseNumber
    ) {
      alertDialog.error("Vui lòng nhập đầy đủ thông tin trước khi tiếp tục.");
      return;
    }
    await userRepository.updateUserProfile(form);
    console.log("Submit:", form); ///TODO: REPLACE WITH BE APIS
    const response = await userRepository.updateUserProfile(form);
    console.log(response);
    alertDialog.notify("Updated user profile");
    navigate("/booking/confirm");
  };

  return (
    <BookingLayout>
      {/* Modern Green Gradient Background - Full viewport height */}
      <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
        <div className="max-w-4xl mx-auto px-4 py-4 flex-1 flex flex-col">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/item/${bookingDataState.itemId}`)}
            className="group flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 transition-colors duration-200 mb-4"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Header - Compact */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
              Đăng ký thuê xe
            </h1>
            <p className="text-gray-600">Điền thông tin để hoàn tất đặt xe</p>
          </div>

          <StepIndicator currentStep={1} />

          {/* Form Card - Flexible height with scrollable content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-6 mb-4 flex-1 flex flex-col min-h-0">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <svg
                  className="w-5 h-5 text-white"
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
              <h2 className="text-xl font-bold text-gray-800">
                Thông tin người thuê
              </h2>
            </div>

            {/* Scrollable form content */}
            <div className="flex-1 overflow-y-auto pr-2">
              <RenterForm
                form={form}
                error={error}
                loading={loading}
                handleChange={handleChange}
              />
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <FormButtons
            onClickNext={onClickNext}
            onClickBack={() => navigate("/booking/register")}
          />
        </div>
      </div>
    </BookingLayout>
  );
};
export default RegisterItemPage;
