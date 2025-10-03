import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { vi } from "date-fns/locale";
import {
  format,
  parseISO,
  isValid,
  differenceInCalendarDays,
  addDays,
} from "date-fns";
import { currencyFormat } from "../pages/ItemDetailPage";
import { useNavigate } from "react-router-dom";
import { RootState, useAppSelector, useAppDispatch } from "../../../../store";
import { collectCreateBookingData } from "../../../booking/store/booking_slice";
import { ref } from "process";
import RentalDatePicker from "../../../schedule/components/RentalDatePicker";
import { BlockedScheduleModel } from "../../../../data/schedule/model/response/BlockedScheduleModel";
import { useQuery } from "react-query";
import { scheduleRepository } from "../../../../data/schedule/repository/schedule_repository";
import { toUtcMidnightISO } from "../../../../common/helper";

/* ------------------------------ Booking Card ------------------------------ */
export const BookingOptionsCard: React.FC<{
  itemId: number;
  pricePerDay: number;
  currency?: string;
  onBook?: (payload: { startDate: string; endDate: string }) => void;
}> = ({ itemId, pricePerDay, currency = "VND", onBook }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchBlockedSchedule = async () => {
    const response = await scheduleRepository.getBlockedSchedule({
      // itemId: "item-001",
      itemId: itemId.toString(),
    });
    ///TODO: remove this later on after be api is all ready
    console.log("Blocked Schedule : ", response);
    return response;
  };

  const { data: blockedSchedules } = useQuery({
    queryKey: "blocked-schedule",
    queryFn: fetchBlockedSchedule,
    refetchInterval: 5000,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // date-fns Vietnamese locale
  const locale = vi;
  const handleBook = () => {
    const bookingData = { startDate, endDate };
    dispatch(
      collectCreateBookingData({
        itemId: itemId,
        startTime: toUtcMidnightISO(new Date(startDate)),
        endTime: toUtcMidnightISO(new Date(endDate)),
      })
    );
    // Gọi callback nếu cần
    onBook?.(bookingData);

    // Chuyển hướng sang trang booking/register
    navigate("/booking/register", { state: bookingData });
  };

  return (
    <aside className="lg:sticky lg:top-24 rounded-3xl border border-black/10 bg-white/80 p-6 md:p-7 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mb-4">
        <div className="text-3xl font-semibold tracking-tight">
          {currencyFormat(pricePerDay, currency)}
          <span className="text-sm font-normal text-gray-500"> / day</span>
        </div>
      </div>

      <RentalDatePicker
        dailyRate={pricePerDay}
        existingRentals={blockedSchedules ?? []}
        onRentalPeriodSelect={(start, end) => {
          setStartDate(start.toString());
          setEndDate(end.toString());
        }}
        onBook={handleBook}
      />
    </aside>
  );
};
