import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  ItemCategory,
  BookingStatus,
  ItemCategoryType,
} from "../../../../../common/types/enums/enums";
import { Dialog, Transition } from "@headlessui/react";
import locale from "antd/es/date-picker/locale/en_US";
import { BookingResponse } from "../../../../../data/booking/model/response/booking_owner_response";
import { bookingRepository } from "../../../../../data/booking/repository/booking_repostitory";
import { convertPaymentStatusTypeToString } from "../../../../../common/helper";

interface FilterDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  applyFilter: (filters: FilterState) => void;
  resetFilter: () => void;
  initialFilters: FilterState;
}

interface FilterState {
  itemCategory: ItemCategoryType;
  bookingStatus: string;
  startDate: string;
  endDate: string;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  closeModal,
  applyFilter,
  resetFilter,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    applyFilter(filters);
    closeModal();
  };

  const handleReset = () => {
    setFilters({
      itemCategory: "ALL",
      bookingStatus: "ALL",
      startDate: "",
      endDate: "",
    });
    resetFilter();
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-4 border-b"
                >
                  Filter Bookings
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Category
                    </label>
                    <select
                      value={filters.itemCategory}
                      onChange={(e) =>
                        handleFilterChange("itemCategory", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={ItemCategory.ALL}>Tất cả</option>
                      <option value={ItemCategory.CAR}>Ô tô</option>
                      <option value={ItemCategory.MOTORBIKE}>Xe máy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Status
                    </label>
                    <select
                      value={filters.bookingStatus}
                      onChange={(e) =>
                        handleFilterChange("bookingStatus", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value={BookingStatus.PENDING}>Pending</option>
                      <option value={BookingStatus.CONFIRMED}>Confirmed</option>
                      <option value={BookingStatus.CANCELLED}>Cancelled</option>
                      <option value={BookingStatus.COMPLETED}>Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  >
                    Delete Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const CurrentBookingsTab = ({
  listBooking,
}: {
  listBooking: BookingResponse[];
}) => {
  return (
    <div className="space-y-4">
      {listBooking.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No current bookings found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Mã booking</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-left">Mã xe</th>
                <th className="px-4 py-3 text-left">Thời gian thuê</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 divide-y divide-gray-200">
              {listBooking.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <a
                      href={`/booking/${booking.id}`}
                      className="text-green-600 hover:underline font-medium"
                    >
                      {booking.id}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        booking.item?.category === ItemCategory.CAR
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {booking.item?.category === ItemCategory.CAR
                        ? "Ô tô"
                        : "Xe máy"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/item/${booking.item?.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {booking.item?.name}
                    </a>
                  </td>
                  {/* TODO: Change locale dynamically */}
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    {convertPaymentStatusTypeToString(booking.paymentStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const BookingHistoryTab = ({
  listBooking,
}: {
  listBooking: BookingResponse[];
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    itemCategory: "ALL",
    bookingStatus: "ALL",
    startDate: "",
    endDate: "",
  });

  // Filter for booking history (cancelled or completed)
  const bookingHistory = listBooking.filter((booking) => {
    // Additional user-applied filters
    if (
      filters.itemCategory !== "ALL" &&
      booking.item?.category !== filters.itemCategory
    ) {
      return false;
    }

    if (
      filters.bookingStatus !== "ALL" &&
      booking.status !== filters.bookingStatus
    ) {
      return false;
    }

    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    const bookingStart = new Date(booking.startTime);
    const bookingEnd = new Date(booking.endTime);

    if (start && bookingStart < start) return false;
    if (end && bookingEnd > end) return false;

    return true;
  });

  const resetFilters = () => {
    setFilters({
      itemCategory: "ALL",
      bookingStatus: "ALL",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Booking History</h3>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          Filter
        </button>
      </div>

      <FilterDialog
        isOpen={isFilterOpen}
        closeModal={() => setIsFilterOpen(false)}
        applyFilter={setFilters}
        resetFilter={resetFilters}
        initialFilters={filters}
      />

      {bookingHistory.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No booking history found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Mã booking</th>
                <th className="px-4 py-3 text-left">Danh mục</th>
                <th className="px-4 py-3 text-left">Mã xe</th>
                <th className="px-4 py-3 text-left">Thời gian thuê</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Thanh toán</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 divide-y divide-gray-200">
              {bookingHistory.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <a
                      href={`/booking/${booking.id}`}
                      className="text-green-600 hover:underline font-medium"
                    >
                      {booking.id}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        booking.item?.category === ItemCategory.CAR
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {booking.item?.category === ItemCategory.CAR
                        ? "Ô tô"
                        : "Xe máy"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/item/${booking.item?.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {booking.item?.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(booking.startTime).toLocaleDateString()} -{" "}
                    {new Date(booking.endTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                        booking.status === BookingStatus.COMPLETED
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {" "}
                    {convertPaymentStatusTypeToString(booking.paymentStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const BookingInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [currentBookings, setCurrentBookings] = useState<BookingResponse[]>([]);
  const [historyBookings, setHistoryBookings] = useState<BookingResponse[]>([]);

  const fetchBooking = async () => {
    const response = await bookingRepository.getAllBookingsByRenter();
    setCurrentBookings(
      response.filter(
        (booking) =>
          booking.status !== BookingStatus.CANCELLED &&
          booking.status !== BookingStatus.COMPLETED
      )
    );
    setHistoryBookings(
      response.filter(
        (booking) =>
          booking.status === BookingStatus.CANCELLED ||
          booking.status === BookingStatus.COMPLETED
      )
    );
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm space-y-6 w-full overflow-hidden">
      <h2 className="text-2xl font-semibold text-gray-800">My Bookings</h2>

      {/* Tab Slider */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "current"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Đơn thuê hiện tại
        </button>
        <button
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Lịch sử
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === "current" ? (
          <CurrentBookingsTab listBooking={currentBookings} />
        ) : (
          <BookingHistoryTab listBooking={historyBookings} />
        )}
      </div>
    </div>
  );
};

export default BookingInfo;
