import React, { useEffect, useState } from "react";
import { mockBookings } from "../../data_mock/mockBookings"; // import your mock data
import { BookingResponse } from "../../../../data/booking/model/response/booking_owner_response";
import { bookingRepository } from "../../../../data/booking/repository/booking_repostitory";
import { convertPaymentStatusTypeToString } from "../../../../common/helper";
import { BookingStatus } from "../../../../common/types/enums/enums";
import { useAppSelector } from "../../../../store";
import { useGlobalAlert } from "../../../../common/components/AlertDialog/AlertProvider";

const RentingOutBookingTab: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingStatus, setBookingStatus] = useState("Tất cả");
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const userProfile = useAppSelector(state => state.auth.user);
  const alertDialog = useGlobalAlert();

  const fetchBookings = async () => {
  if(!!userProfile?.id){
      const response = await bookingRepository.getAllBookingsByOwner(userProfile?.id);
      setBookings(response);
      console.log("Booking by owner res: ", response );
      return;
  }
  alertDialog.error("Failed to fetch bookings by owner");
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusMap: {
    [key in
      | "Đã xác nhận"
      | "Chờ xử lý"
      | "Đã hủy"
      | "Hoàn thành"
      | "Đang đàm phán"]: string;
  } = {
    "Đã xác nhận": "CONFIRMED",
    "Chờ xử lý": "PENDING",
    "Đã hủy": "CANCELLED",
    "Hoàn thành": "COMPLETED",
    "Đang đàm phán": "NEGOTIATION",
  };

  const filteredBookings = bookings.filter((booking) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    if (start && bookingStart < start) return false;
    if (end && bookingEnd > end) return false;

    if (
      bookingStatus !== "Tất cả" &&
      booking.status.toString() !==
        statusMap[bookingStatus as keyof typeof statusMap]
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Trạng thái đơn thuê
          </label>
          <select
            value={bookingStatus}
            onChange={(e) => setBookingStatus(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang đàm phán">Đang đàm phán</option>
            <option value="Đã hủy">Đã hủy</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Table of filtered bookings */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-2 text-left">Mã booking</th>
              <th className="px-4 py-2 text-left">Mã xe</th>
              <th className="px-4 py-2 text-left">Thời gian thuê</th>
              <th className="px-4 py-2 text-left">Trạng thái</th>
              <th className="px-4 py-2 text-left">Thanh toán</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredBookings.map((booking, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <a
                    href={`/booking/owner-confirm/${booking.id}`}
                    className="text-green-600 hover:underline"
                  >
                    {booking.id}
                  </a>
                </td>
                <td className="px-4 py-2">
                  <a
                    href={`/item/${booking.item?.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {booking.item?.name}
                  </a>
                </td>
                <td className="px-4 py-2">
                  {new Date(booking.startTime).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(booking.endTime).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      booking.status === BookingStatus.CONFIRMED
                        ? "bg-green-50 text-green-700"
                        : booking.status === BookingStatus.PENDING
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {convertPaymentStatusTypeToString(booking.paymentStatus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentingOutBookingTab;
