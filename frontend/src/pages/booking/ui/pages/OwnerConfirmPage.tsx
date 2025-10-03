import { useEffect, useMemo, useState } from "react";
import BookingLayout from "../layout/BookingLayout";
import { useParams } from "react-router-dom";
import { bookingRepository } from "../../../../data/booking/repository/booking_repostitory";
import { BookingResponse } from "../../../../data/booking/model/response/booking_owner_response";
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import { UserBasicInfoResponse } from "../../../../data/user/model/response/user_basic_info_response";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { UserResponse } from "../../../../data/user/model/response/user_response";
import {
  AvailabilityStatusType,
  BookingStatus,
  ItemCategoryType,
  PaymentBookingStatus,
} from "../../../../common/types/enums/enums";
import {
  getStatusColor,
  getPaymentStatusColor,
  getStatusIcon,
} from "../../../../common/helper/statusHelper";
import { useQuery } from "react-query";

type BookingView = {
  id: string;
  itemId: string;
  renterId: string;
  renterName: string;
  ownerName: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const OwnerConfirmPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<BookingResponse>({
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
      availabilityStatus: "" as AvailabilityStatusType, // hoặc AvailabilityStatusType.AVAILABLE nếu có enum
      createdAt: "",
      itemValue: 0,
      category: "" as ItemCategoryType, // hoặc ItemCategoryType.DEFAULT
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
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<null | string>(null); // key hành động đang chạy

  const getDetail = async () => {
    try {
      // if (!id) return;
      const response = await bookingRepository.getBookingById(Number(id));
      console.log("Response", response);
      // const response = await getDetailBooking(id);
      setBooking(response);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  useQuery({
    queryKey: ["owner-booking-detail"],
    queryFn: async () => {
      const response = await bookingRepository.getBookingById(Number(id));
      setBooking(response);
      return response;
    },
    refetchInterval: 1500, // Tự động refetch mỗi 1.5 giây
  });

  useEffect(() => {
    getDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking]);

  // const status = (booking.status || "").trim().toLowerCase();

  // Get semantic colors for statuses
  const statusColors = getStatusColor(booking.status);
  const paymentStatusColors = getPaymentStatusColor(booking.paymentStatus);
  const statusIconPath = getStatusIcon(booking.status);

  // --- Handlers gọi API tương ứng (TODO: nối với API thực) ---
  const handleReject = async () => {
    try {
      setActionLoading("reject");
      // TODO: gọi API từ chối
      const response = await bookingRepository.updateBookingInfo({
        bookingId: booking.id,
        status: BookingStatus.CANCELLED,
      });
      console.log("new status: ", booking.status);
      // await rejectBooking(booking.id);
      console.log("Từ chối", booking.id);
      await getDetail();
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = async () => {
    try {
      setActionLoading("confirm");
      // TODO: gọi API xác nhận
      const response = await bookingRepository.updateBookingInfo({
        bookingId: booking.id,
        status: BookingStatus.CONFIRMED,
      });
      // await confirmBooking(booking.id);
      console.log("Xác nhận", booking.id);
      await getDetail();
    } finally {
      setActionLoading(null);
    }
  };

  const handleNegotiate = async () => {
    try {
      setActionLoading("negotiate");
      // TODO: gọi API thương lượng
      const response = await bookingRepository.updateBookingInfo({
        bookingId: booking.id,
        status: BookingStatus.NEGOTIATION,
      });
      // await negotiateBooking(booking.id);
      console.log("Thương lượng", booking.id);
      await getDetail();
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading("complete");
      // TODO: gọi API hoàn thành
      const response = await bookingRepository.updateBookingInfo({
        bookingId: booking.id,
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentBookingStatus.FULLY_PAID,
      });
      // await completeBooking(booking.id);
      console.log("Hoàn thành", booking.id);
      await getDetail();
    } finally {
      setActionLoading(null);
    }
  };

  // Map trạng thái => danh sách nút
  type Action = {
    key: string;
    label: string;
    className: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
  };

  const actions: Action[] = useMemo(() => {
    switch ((booking.status || "").trim().toLowerCase()) {
      case "pending":
        return [
          {
            key: "reject",
            label: "Từ chối",
            className: "bg-red-500 hover:bg-red-600",
            onClick: handleReject,
          },
          {
            key: "confirm",
            label: "Xác nhận",
            className: "bg-green-500 hover:bg-green-600",
            onClick: handleConfirm,
          },
        ];

      case "confirmed":
        return booking.paymentStatus !== PaymentBookingStatus.RENTAL_PAID
          ? []
          : [
              {
                key: "negotiate",
                label: "Thương lượng",
                className: "bg-yellow-500 hover:bg-yellow-600",
                onClick: handleNegotiate,
              },
              {
                key: "complete",
                label: "Hoàn thành",
                className: "bg-green-500 hover:bg-green-600",
                onClick: handleComplete,
              },
            ];

      case "negotiation":
        return [
          {
            key: "negotiate",
            label: "Thương lượng",
            className: "bg-yellow-300 cursor-not-allowed",
            onClick: () => {},
            disabled: true,
          },
          {
            key: "complete",
            label: "Hoàn thành",
            className: "bg-green-500 hover:bg-green-600",
            onClick: handleComplete,
          },
        ];

      case "cancelled":
      case "completed":
        return [];

      default:
        return [];
    }
  }, [booking]);

  // Determine if there is any enabled action (not disabled and no global actionLoading)
  const hasAnyEnabled = useMemo(() => {
    return actions.some((a) => !a.disabled);
  }, [actions]);

  return (
    <BookingLayout>
      {/* Modern Green Gradient Background - Full viewport height */}
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
        <div
          className={`max-w-5xl mx-auto px-4 py-4 flex-1 flex flex-col ${
            hasAnyEnabled ? "pb-28 md:pb-10" : "pb-6"
          }`}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/account/my-items")}
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
              Chi tiết đơn thuê
            </h1>
            <p className="text-gray-600">Xác nhận và quản lý đơn thuê xe</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center space-x-3 py-8 flex-1">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="text-emerald-700 font-medium">
                Đang tải chi tiết đơn thuê...
              </span>
            </div>
          )}

          {/* Details Card - Flexible height with scrollable content */}
          {!loading && (
            <>
              {/* Summary Card - compact like RentalDetailPage */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100 p-6 mb-4">
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
                </div>
              </div>

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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Thông tin đơn thuê
                  </h2>
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Mã xe
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {booking.item.name}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Họ và tên người thuê
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {booking.renter.name}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Email người thuê
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {booking.renter.email || "-"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Trạng thái đơn
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span
                            className={`${statusColors.text} ${statusColors.bg} border ${statusColors.border} font-bold text-sm px-3 py-1 rounded-md uppercase tracking-wide inline-block shadow-sm`}
                          >
                            {booking.status || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Số điện thoại người thuê
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {booking.renter.phone || "-"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Địa chỉ xe
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {booking.item.address || "-"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          ThờsetLoadingi gian tạo đơn thuê
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span className="text-gray-800 font-medium text-sm">
                            {/* {booking.createdAt} */}
                            {formatDateTime(booking.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-emerald-700 mb-2">
                          Trạng thái thanh toán
                        </label>
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
                          <span
                            className={`${paymentStatusColors.text} ${paymentStatusColors.bg} border ${paymentStatusColors.border} font-bold text-sm px-3 py-1 rounded-md uppercase tracking-wide inline-block shadow-sm`}
                          >
                            {booking.paymentStatus || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action Bar - visible only when there's any enabled action */}
              {hasAnyEnabled && (
                <div className="fixed bottom-0 left-0 right-0 z-40 md:static">
                  <div className="mx-auto max-w-5xl px-4 md:px-6 py-3">
                    <div className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl ring-1 ring-white/20 backdrop-blur p-3">
                      <div className="flex flex-col sm:flex-row space- sm:justify-between">
                        {actions.map((a) => {
                          let buttonColors = "";
                          let iconPath = "";

                          switch (a.key) {
                            case "reject":
                              buttonColors = a.disabled
                                ? "bg-white/20 text-white/60 cursor-not-allowed"
                                : "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700 ring-2 ring-white/70";
                              iconPath = "M6 18L18 6M6 6l12 12";
                              break;
                            case "confirm":
                              buttonColors = a.disabled
                                ? "bg-white/20 text-white/60 cursor-not-allowed"
                                : "bg-white text-emerald-700 hover:text-emerald-800 ring-2 ring-white/70";
                              iconPath = "M5 13l4 4L19 7";
                              break;
                            case "negotiate":
                              buttonColors = a.disabled
                                ? "bg-white/20 text-white/60 cursor-not-allowed"
                                : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 ring-2 ring-white/70";
                              iconPath =
                                "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z";
                              break;
                            case "complete":
                              buttonColors = a.disabled
                                ? "bg-white/20 text-white/60 cursor-not-allowed"
                                : "bg-white text-emerald-700 hover:text-emerald-800 ring-2 ring-white/70";
                              iconPath =
                                "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
                              break;
                            default:
                              buttonColors = "bg-white/20 text-white/60";
                              iconPath =
                                "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
                          }

                          return (
                            <button
                              key={a.key}
                              onClick={a.onClick}
                              disabled={!!actionLoading || a.disabled}
                              className={`group w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${buttonColors}`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d={iconPath}
                                />
                              </svg>
                              <span>
                                {actionLoading === a.key
                                  ? "Đang xử lý..."
                                  : a.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BookingLayout>
  );
};

function formatDateTime(dateString: string) {
  if (!dateString) return "-";
  return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
}

export default OwnerConfirmPage;
