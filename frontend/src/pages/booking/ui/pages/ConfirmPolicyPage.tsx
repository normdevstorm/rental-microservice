import BookingLayout from "../layout/BookingLayout";
import StepIndicator from "../components/StepIndicator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateBookingRequest } from "../../../../data/booking/model/request/create_booking_request";
import { useGlobalAlert } from "../../../../common/components/AlertDialog/AlertProvider";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { createBooking } from "../../../../presentation/booking/store/booking_slice";
import {
  persistor,
  store,
  useAppDispatch,
  useAppSelector,
} from "../../../../store";
import { StateStatus } from "../../../../common/types/enums/enums";

const ConfirmPolicyPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alertDialog = useGlobalAlert();
  const bookingDataState: CreateBookingRequest = useAppSelector(
    (state) => state.booking.bookingData
  ) as CreateBookingRequest;

  useEffect(() => {
    // Add this listener in the useEffect and clean up on unmount
    const unsubscribe = store.subscribe(() => {
      const bookingState = store.getState().booking;
      if (bookingState.status === StateStatus.SUCCESS) {
        alertDialog.notify("Đơn thuê được tạo thành công");
        navigate("/account/my-bookings", { replace: true });
      } else if (bookingState.status === StateStatus.ERROR) {
        alertDialog.error(
          bookingState.error ||
            "Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại."
        );
      } else if (bookingState.status === StateStatus.PROCESSING) {
        alertDialog.notify("Đang xử lý đơn thuê...");
      }
    });

    // Cleanup: remove listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleNext = async () => {
    if (!agreed) {
      alertDialog.error("Bạn cần đồng ý với chính sách trước khi tiếp tục.");
      return;
    }
    try {
      const response = await dispatch(
        createBooking({
          itemId: bookingDataState.itemId,
          startTime: bookingDataState.startTime,
          endTime: bookingDataState.endTime,
        } as CreateBookingRequest)
      );
    } catch (error) {
      alertDialog.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
    }
    // Chuyển sang bước tiếp theo
  };

  // Only show the bottom action bar when the primary action is enabled
  const hasAnyEnabled = agreed;
  const contentBottomPadding = hasAnyEnabled ? "pb-28 md:pb-10" : "pb-6";

  return (
    <BookingLayout>
      {/* Modern Green Gradient Background - Full viewport height */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
        <div
          className={`max-w-5xl mx-auto px-4 py-4 flex-1 flex flex-col ${contentBottomPadding}`}
        >
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
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-2">
              Đăng ký thuê xe
            </h1>
            <p className="text-gray-600">Hoàn tất quy trình đặt xe của bạn</p>
          </div>

          <StepIndicator currentStep={2} />

          {/* Summary Card - compact info like RentalDetailPage */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-6 mt-4">
            <div className="flex items-center gap-3">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-500">Mã xe</div>
                <div className="text-xl font-bold text-gray-800">
                  #{String(bookingDataState.itemId ?? "")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 items-stretch">
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                <div className="text-xs text-emerald-700 font-semibold">
                  Bắt đầu
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {bookingDataState.startTime
                      ? format(new Date(bookingDataState.startTime), "dd/MM/yyyy")
                      : "-"}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                <div className="text-xs text-emerald-700 font-semibold">
                  Kết thúc
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {bookingDataState.endTime
                      ? format(new Date(bookingDataState.endTime), "dd/MM/yyyy")
                      : "-"}
                </div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                <div className="text-xs text-emerald-700 font-semibold">
                  Mã xe
                </div>
                <div className="text-sm font-medium text-gray-800 truncate">
                  {String(bookingDataState.itemId ?? "")}
                </div>
              </div>
            </div>
          </div>
          <div className="h-5" />

          {/* Policy Card - Flexible height with scrollable content */}
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Chính sách thuê
              </h2>
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-gray-800 font-medium text-sm">
                  Để bảo vệ quyền lợi của tất cả các thành viên Mioto khỏi sự cố
                  ngoài ý muốn phát sinh trong quá trình thuê xe và tuân thủ các
                  điều khoản giao kết từ hai bên:
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Payment Terms */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-emerald-700 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Điều khoản thanh toán</span>
                  </h3>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>
                        Thanh toán bảo cọc (5% giá trị) sau khi nhận được "xác
                        nhận đơn" từ phía chủ xe.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>
                        Phần còn lại sẽ được thanh toán đầy đủ sau khi hoàn
                        thành hợp đồng thuê.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Thanh toán bằng tiền mặt hoặc chuyển khoản.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>
                        Tài xế phải chịu mọi trách nhiệm về thiệt hại không hạt
                        nhân.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Cancellation Policy */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-emerald-700 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Chính sách hủy đơn</span>
                  </h3>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Hủy trước 12 tiếng, hoàn 50%.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Hủy trước 6 tiếng, hoàn 30%.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Các trường hợp khác sẽ không được hoàn tiền.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox - Fixed at bottom */}
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
              <label
                htmlFor="agree"
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                      agreed
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 border-emerald-500"
                        : "border-gray-300 group-hover:border-emerald-400"
                    }`}
                  >
                    {agreed && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium text-sm">
                    Tôi đồng ý với chính sách của Mioto
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Bar - visible only when primary is enabled */}
          {
            <div className="fixed bottom-0 left-0 right-0 z-40 md:static">
              <div className="mx-auto max-w-5xl px-4 md:px-6 py-3">
                <div className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur p-3">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <button
                      className="group w-full sm:w-auto px-6 py-3 bg-white text-emerald-700 border-2 border-emerald-200 rounded-xl font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      onClick={() => navigate("/booking/register")}
                    >
                      <svg
                        className="w-4 h-4 transition-transform group-hover:-translate-x-1"
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
                      <span>Quay lại</span>
                    </button>
                    <button
                      className={`group w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        agreed
                          ? "bg-white text-emerald-700 hover:text-emerald-800 shadow-xl hover:shadow-2xl ring-2 ring-white/70 hover:ring-white"
                          : "bg-white/20 text-white/60 cursor-not-allowed"
                      }`}
                      onClick={handleNext}
                      disabled={!agreed}
                      hidden={!agreed}
                    >
                      <span>Đặt đơn</span>
                      <svg
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </BookingLayout>
  );
};

export default ConfirmPolicyPage;
