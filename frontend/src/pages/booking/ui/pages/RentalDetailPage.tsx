import { useEffect, useMemo, useState, type ReactNode } from "react";
import BookingLayout from "../layout/BookingLayout";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

import { bookingRepository } from "../../../../data/booking/repository/booking_repostitory";
import { BookingResponse } from "../../../../data/booking/model/response/booking_owner_response";
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import { UserBasicInfoResponse } from "../../../../data/user/model/response/user_basic_info_response";
import { useNavigate } from "react-router";
import { UserResponse } from "../../../../data/user/model/response/user_response";
import {
  AvailabilityStatusType,
  ItemCategoryType,
  BookingStatus,
  PaymentBookingStatus,
} from "../../../../common/types/enums/enums";
import {
  getStatusColor,
  getPaymentStatusColor,
} from "../../../../common/helper/statusHelper";
import { useQuery } from "react-query";

// Initial value thống nhất với Page 2
const initialBookingOwnerResponse: BookingResponse = {
  id: 0,
  item: {
    id: 0,
    owner: {
      id: 0,
      name: "",
      email: "",
      phone: "",
      address: "",
      role: [],
      isActive: false,
      createdAt: "",
    } as UserResponse,
    name: "",
    description: "",
    price: 0,
    latePrice: 0,
    depositAmount: 0,
    amount: 0,
    address: "",
    conditionRating: 0,
    availabilityStatus: "" as AvailabilityStatusType,
    createdAt: "",
    itemValue: 0,
    category: "" as ItemCategoryType,
    itemImages: [],
    itemDetail: null,
  } as ItemResponse,
  renter: {
    id: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: undefined,
  } as UserBasicInfoResponse,
  startTime: "",
  endTime: "",
  status: "",
  paymentStatus: "",
  notes: "",
  cancellationReason: "",
  createdAt: "",
  updatedAt: "",
};

type InfoRowProps = {
  label: string;
  children: ReactNode;
};
const InfoRow = ({ label, children }: InfoRowProps) => (
  <div className="space-y-1">
    <label className="block text-xs font-semibold text-emerald-700 tracking-wide">
      {label}
    </label>
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
      <span className="text-gray-800 font-medium text-sm break-words">
        {children}
      </span>
    </div>
  </div>
);

type ActionBarProps = {
  cancelDisabled: boolean;
  payDisabled: boolean;
  actionLoading: null | "cancel" | "pay";
  payButtonText: string;
  onCancel: () => void;
  onPay: () => void;
};

const ActionBar = ({
  cancelDisabled,
  payDisabled,
  actionLoading,
  payButtonText,
  onCancel,
  onPay,
}: ActionBarProps) => {
  const isCancelDisabled = cancelDisabled;
  const isPayDisabled = payDisabled;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:static">
      <div className=" mx-auto max-w-5xl px-4 md:px-6 py-3">
        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur p-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <button
              className={`group w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isCancelDisabled
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-200 to-red-400 hover:from-rose-400 hover:to-red-400 shadow-lg hover:shadow-xl ring-2 ring-white/70 text-red-600"
              }`}
              onClick={onCancel}
              disabled={isCancelDisabled}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>
                {actionLoading === "cancel" ? "Đang hủy..." : "Hủy đơn"}
              </span>
            </button>
            <button
              className={`group w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isPayDisabled
                  ? "bg-white/20 text-white/60 cursor-not-allowed"
                  : "bg-white text-emerald-700 hover:text-emerald-800 shadow-xl hover:shadow-2xl ring-2 ring-white/70 hover:ring-white animate-[pulse_3s_ease-in-out_infinite]"
              }`}
              onClick={onPay}
              disabled={isPayDisabled}
            >
              <svg
                className={`w-4 h-4 ${
                  isPayDisabled ? "text-white/70" : "text-emerald-700"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>
                {actionLoading === "pay" ? "Đang xử lý..." : payButtonText}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RentalDetailPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingResponse>(
    initialBookingOwnerResponse
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Giống Page 2: có actionLoading để biết nút nào đang xử lý
  const [actionLoading, setActionLoading] = useState<null | "cancel" | "pay">(
    null
  );

  useQuery({
    queryKey: ["renter-booking-detail"],
    queryFn: async () => {
      const response = await bookingRepository.getBookingById(Number(id));
      setBooking(response);
      return response;
    },
  });

  const getDetail = async () => {
    try {
      setError(null);
      if (!id) {
        setError("Thiếu mã đơn thuê trong URL.");
        return;
      }
      const numericId = Number(id);
      if (Number.isNaN(numericId)) {
        setError("Mã đơn thuê không hợp lệ.");
        return;
      }

      const response = await bookingRepository.getBookingById(numericId);
      setBooking(response);
    } catch (e: any) {
      console.error("Error fetching booking details:", e);
      setError(e?.message || "Không thể tải chi tiết đơn thuê.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
  }, [id]);

  // Chuẩn hóa status và paymentStatus để dùng trong UI
  const status = (booking.status || "").trim().toLowerCase();
  const paymentStatus = (booking.paymentStatus || "").trim().toUpperCase();

  // --- Handler HỦY ĐƠN: cập nhật trạng thái CANCELLED ---
  const handleCancel = async () => {
    if (!booking?.id) return;

    // Nếu đã cancelled/completed thì không cho hủy
    if (["cancelled", "completed"].includes(status)) return;

    const ok = window.confirm("Bạn có chắc muốn hủy đơn thuê này?");
    if (!ok) return;

    try {
      setActionLoading("cancel");
      await bookingRepository.updateBookingInfo({
        bookingId: booking.id,
        status: BookingStatus.CANCELLED,
      });
      await getDetail();
    } catch (e) {
      console.error("Hủy đơn thất bại:", e);
      alert("Hủy đơn thất bại. Vui lòng thử lại!");
    } finally {
      setActionLoading(null);
    }
  };

  // --- Handler Thanh toán: xử lý cọc / tiền thuê và cập nhật backend ---
  const handlePay = async () => {
    if (!booking?.id) return;
    if (status !== "confirmed") return; // chỉ cho phép ở CONFIRMED

    try {
      setActionLoading("pay");
      if (paymentStatus === "INITIAL") {
        await bookingRepository.updateBookingInfo({
          bookingId: booking.id,
          paymentStatus: PaymentBookingStatus.DEPOSIT_PAID,
        });
        setBooking((prev) => ({ ...prev, paymentStatus: "DEPOSIT_PAID" }));
        alert("Thanh toán cọc thành công!");
      } else if (paymentStatus === "DEPOSIT_PAID") {
        await bookingRepository.updateBookingInfo({
          bookingId: booking.id,
          paymentStatus: PaymentBookingStatus.RENTAL_PAID,
        });
        await getDetail();
        alert("Thanh toán tiền thuê thành công!");
      } else {
        alert("Trạng thái thanh toán hiện tại không hợp lệ để thanh toán.");
      }
    } catch (e) {
      console.error("Thanh toán thất bại:", e);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    } finally {
      setActionLoading(null);
    }
  };

  // --- UI state buttons (giống tinh thần setAction ở Page 2) ---
  const controls = useMemo(() => {
    let cancelDisabled = true;
    let payDisabled = true;

    if (status === "pending") {
      cancelDisabled = !!actionLoading; // pending: có thể hủy
      payDisabled = true; // pending: không được thanh toán
    } else if (status === "confirmed") {
      cancelDisabled = true; // confirmed: không cho hủy
      payDisabled = !!actionLoading
        ? true
        : paymentStatus === "RENTAL_PAID" || paymentStatus === "FULLY_PAID";
    } else if (["negotiation", "cancelled", "completed"].includes(status)) {
      cancelDisabled = true;
      payDisabled = true;
    }

    return { cancelDisabled, payDisabled };
  }, [status, actionLoading, paymentStatus]);

  // Show action bar only when at least one button is enabled
  const hasAnyEnabled = !controls.cancelDisabled || !controls.payDisabled;
  const contentBottomPadding = hasAnyEnabled ? "pb-28 md:pb-10" : "pb-10";

  // Nhãn nút thanh toán theo trạng thái
  const payButtonText = useMemo(() => {
    if (status === "confirmed") {
      if (paymentStatus === "INITIAL") return "Thanh toán cọc";
      if (paymentStatus === "DEPOSIT_PAID") return "Thanh toán tiền thuê";
      if (paymentStatus === "RENTAL_PAID" || paymentStatus === "FULLY_PAID")
        return "Đã thanh toán";
    }
    return "Thanh toán";
  }, [status, paymentStatus]);

  // Get semantic colors for statuses
  const statusColors = getStatusColor(booking.status);
  const paymentStatusColors = getPaymentStatusColor(booking.paymentStatus);

  if (loading) {
    return (
      <BookingLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <span className="text-emerald-700 font-medium">
              Đang tải chi tiết đơn thuê...
            </span>
          </div>
        </div>
      </BookingLayout>
    );
  }

  if (error) {
    return (
      <BookingLayout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
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
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div
          className={`max-w-5xl mx-auto px-4 md:px-6 pt-4 ${contentBottomPadding}`}
        >
          {/* Back */}
          <button
            onClick={() => navigate("/account/my-bookings")}
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

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-1">
              Chi tiết đơn thuê
            </h1>
            <p className="text-gray-600">
              Thông tin chi tiết đơn thuê xe của bạn
            </p>
          </div>

          <div className="grid gap-6">
            {/* Summary Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4">
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
                    <div className="text-sm text-gray-500">Mã đơn thuê</div>
                    <div className="text-xl font-bold text-gray-800">
                      #{String(booking.id)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 items-stretch">
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                  <div className="text-xs text-emerald-700 font-semibold">
                    Bắt đầu
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {/* {booking.startTime || "-"} */}

                    {booking.startTime
                      ? format(new Date(booking.startTime), "dd/MM/yyyy")
                      : "-"}
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                  <div className="text-xs text-emerald-700 font-semibold">
                    Kết thúc
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    {/* {booking.endTime || "-"} */}
                    {booking.endTime
                      ? format(new Date(booking.endTime), "dd/MM/yyyy")
                      : "-"}
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                  <div className="text-xs text-emerald-700 font-semibold">
                    Chủ xe
                  </div>
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {booking.item?.owner?.name || "-"}
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 h-full">
                  <div className="text-xs text-emerald-700 font-semibold">
                    Người thuê
                  </div>
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {booking.renter?.name || "-"}
                  </div>
                </div>
                {/* No status badges here to keep the top card compact */}
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Mã xe">
                  {String(booking.item?.name ?? "")}
                </InfoRow>
                <InfoRow label="Thời gian tạo đơn thuê">
                  {/* {booking.createdAt || "-"} */}
                  {formatDateTime(booking.createdAt)}
                </InfoRow>

                <InfoRow label="Họ và tên chủ xe">
                  {booking.item?.owner?.name ?? "-"}
                </InfoRow>

                <InfoRow label="Email chủ xe">
                  {booking.item?.owner?.email || "-"}
                </InfoRow>

                <InfoRow label="Số điện thoại chủ xe">
                  {booking.item?.owner?.phone || "-"}
                </InfoRow>

                <InfoRow label="Địa chỉ xe">
                  {booking.item?.address || "-"}
                </InfoRow>

                {/* Replaced notes with status and payment status */}
                <InfoRow label="Trạng thái đơn">
                  <span
                    className={`${statusColors.text} font-semibold px-2 py-1 rounded-md ${statusColors.bg} border ${statusColors.border}`}
                  >
                    {booking.status || "-"}
                  </span>
                </InfoRow>

                <InfoRow label="Trạng thái thanh toán">
                  <span
                    className={`${paymentStatusColors.text} font-semibold px-2 py-1 rounded-md ${paymentStatusColors.bg} border ${paymentStatusColors.border}`}
                  >
                    {booking.paymentStatus || "-"}
                  </span>
                </InfoRow>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar Component */}
        {hasAnyEnabled && (
          <ActionBar
            cancelDisabled={controls.cancelDisabled}
            payDisabled={controls.payDisabled}
            actionLoading={actionLoading}
            payButtonText={payButtonText}
            onCancel={handleCancel}
            onPay={handlePay}
          />
        )}
      </div>
    </BookingLayout>
  );
};

function formatDateTime(dateString: string) {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
}

export default RentalDetailPage;
