// components/RentalDatePicker.tsx
import React, { useState } from "react";
import RentalCalendar from "./RentalCalendar";
import { formatThousands } from "../../../pages/rent-out/ui/components/CurrencyInput";
import { BlockedScheduleModel } from "../../../data/schedule/model/response/BlockedScheduleModel";

interface RentalDatePickerProps {
  existingRentals: BlockedScheduleModel[];
  onRentalPeriodSelect: (startDate: Date, endDate: Date) => void;
  onBook: () => void;
  dailyRate?: number;
}

const RentalDatePicker: React.FC<RentalDatePickerProps> = ({
  existingRentals,
  onRentalPeriodSelect,
  onBook,
  dailyRate = 0,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setSelectedStartDate(start);
    setSelectedEndDate(end);

    if (start && end) {
      onRentalPeriodSelect(start, end);
    }
  };

  const calculateTotalDays = () => {
    if (!selectedStartDate || !selectedEndDate) return 0;
    const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotalPrice = () => {
    return calculateTotalDays() * dailyRate;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <RentalCalendar
        existingRentals={existingRentals}
        onDateSelect={handleDateSelect}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
      />

      {selectedStartDate && selectedEndDate && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Rental Summary
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium text-gray-800">
                {formatDate(selectedStartDate)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium text-gray-800">
                {formatDate(
                  new Date(selectedEndDate.getTime() - 24 * 60 * 60 * 1000)
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Days:</span>
              <span className="font-medium text-blue-600">
                {calculateTotalDays()} ngày
              </span>
            </div>

            {dailyRate > 0 && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-medium text-gray-800">
                    {formatThousands(dailyRate.toString())}
                    <b>đ</b>
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3">
                  <span className="text-gray-800 font-semibold">
                    Total Price:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatThousands(calculateTotalPrice().toString())}
                    <b>đ</b>
                  </span>
                </div>
              </>
            )}
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={
              !selectedStartDate ||
              !selectedEndDate ||
              calculateTotalDays() <= 0
            }
            onClick={onBook}
            aria-label="Book now"
          >
            Book now
          </button>
        </div>
      )}
    </div>
  );
};

export default RentalDatePicker;
