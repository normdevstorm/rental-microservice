// components/RentalCalendar.tsx
import React, { useState, useMemo, useEffect } from "react";
import { CalendarProps } from "../types/rental";
import { useGlobalAlert } from "../../../common/components/AlertDialog/AlertProvider";

const DAY_MS = 24 * 60 * 60 * 1000; // normalize to 00:00; safe for DST when at midnight
const MAX_NIGHTS = 30; // <= 30 nights

/** Normalize to 00:00 local */
const toMidnight = (d: Date | null | undefined) => {
  if (!d) return null;
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** Add whole days at midnight (safer than adding ms) */
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

const sameDay = (a?: Date | null, b?: Date | null) => {
  if (!a || !b) return false;
  return toMidnight(a)!.getTime() === toMidnight(b)!.getTime();
};

// Calendar bounds (defaults: tomorrow .. +1y)
const today = new Date();
today.setHours(0, 0, 0, 0);
const calMinDate = addDays(today, 1);
const calMaxDate = addDays(today, 365);

const RentalCalendar: React.FC<CalendarProps> = ({
  existingRentals,
  onDateSelect,
  selectedStartDate,
  selectedEndDate,
  minDate = calMinDate,
  maxDate = calMaxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const alertDialog = useGlobalAlert();

  // ---- DISABLE rule: start..(end-1) ----
  // end is exclusive; the end day remains available for a new booking at 00:00.
  const isDateDisabled = useMemo(() => {
    return (date: Date): boolean => {
      const d = toMidnight(date)!;
      const min = toMidnight(minDate)!;
      const max = toMidnight(maxDate)!;
      if (d < min || d > max) return true;

      return existingRentals.some((rental) => {
        const rentalStart = toMidnight(new Date(rental.startTime))!;
        const rentalEnd = toMidnight(new Date(rental.endTime))!;
        // disable inclusive of start, exclusive of end: blocks start..(end-1)
        return d >= rentalStart && d < rentalEnd;
      });
    };
  }, [existingRentals, minDate, maxDate]);

  /** Validate [start, end) where both are 00:00. 1..30 nights, no blocked days */
  const isRangeValid = (start: Date, end: Date): boolean => {
    const s = toMidnight(start)!;
    const e = toMidnight(end)!;
    const nights = Math.round((e.getTime() - s.getTime()) / DAY_MS);

    if (nights < 1 || nights > MAX_NIGHTS) {
      alertDialog.error("Must be at least 1 day and no more than 30 days");
      return false;
    }

    // Scan each midnight in [s .. e] (including e; harmless because end is free)
    const cur = new Date(s);
    while (cur <= e) {
      if (isDateDisabled(cur)) return false;
      cur.setDate(cur.getDate() + 1);
    }
    return true;
  };

  const clearSelection = () => {
    onDateSelect?.(null, null);
    setTempEndDate(null);
  };

  // Keyboard support: Esc to clear
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Core behavior:
   *  - First click (no start): commit 1 night = [d, d+1) if valid; else start-only fallback.
   *  - Second click (inclusive): [start, clicked+1)
   *  - Deselect behavior:
   *      * If selection is 1 night and user clicks the selected day again -> clear.
   *      * If selection is multi-night and user clicks start -> collapse to [start, start+1); click again -> clear.
   *      * If selection is multi-night and user clicks visual end -> collapse to [visualEnd, visualEnd+1); click again -> clear.
   */
  const handleDateClick = (date: Date) => {
    const d = toMidnight(date)!;
    if (isDateDisabled(d)) return;

    const start = toMidnight(selectedStartDate);
    const end = toMidnight(selectedEndDate);
    const visualEnd = end ? addDays(end, -1) : null; // where we paint the end marker

    // 1) No start yet -> auto commit 1 night if possible
    if (!start) {
      const oneNightEnd = addDays(d, 1);
      if (oneNightEnd <= toMidnight(maxDate)! && isRangeValid(d, oneNightEnd)) {
        onDateSelect?.(d, oneNightEnd);
        setTempEndDate(null);
      } else {
        // Fallback to start-only (await second click) if the auto 1-night is invalid
        onDateSelect?.(d, null);
        setTempEndDate(null);
      }
      return;
    }

    // 2) Have start but no end (rare, but supported): inclusive second click
    if (start && !end) {
      if (d < start) {
        // restart from earlier date as 1 night
        const oneNightEnd = addDays(d, 1);
        if (
          oneNightEnd <= toMidnight(maxDate)! &&
          isRangeValid(d, oneNightEnd)
        ) {
          onDateSelect?.(d, oneNightEnd);
        } else {
          clearSelection();
        }
      } else if (d.getTime() === start.getTime()) {
        // clicking the same start -> toggle: if already 1-night intent, clear; else set 1 night
        // since there is no end yet here, set 1 night
        onDateSelect?.(start, addDays(start, 1));
      } else {
        const inclusiveEnd = addDays(d, 1);
        if (
          inclusiveEnd <= toMidnight(maxDate)! &&
          isRangeValid(start, inclusiveEnd)
        ) {
          onDateSelect?.(start, inclusiveEnd);
        } else {
          clearSelection();
        }
      }
      setTempEndDate(null);
      return;
    }

    // 3) Have both start & end (normal case): handle deselect toggles and inclusive extend
    if (start && end) {
      const isSingleNight = sameDay(start, visualEnd);

      // Clicked the start tile
      if (sameDay(d, start)) {
        if (isSingleNight) {
          // single-night -> clear
          clearSelection();
        } else {
          // multi-night -> collapse to 1 night at start
          onDateSelect?.(start, addDays(start, 1));
          setTempEndDate(null);
        }
        return;
      }

      // Clicked the visual end tile
      if (visualEnd && sameDay(d, visualEnd)) {
        if (isSingleNight) {
          // single-night -> clear
          clearSelection();
        } else {
          // multi-night -> collapse to 1 night at end day
          onDateSelect?.(visualEnd, addDays(visualEnd, 1));
          setTempEndDate(null);
        }
        return;
      }

      // Clicked somewhere else:
      // - If before start -> restart from that day as 1 night
      if (d < start) {
        const oneNightEnd = addDays(d, 1);
        if (
          oneNightEnd <= toMidnight(maxDate)! &&
          isRangeValid(d, oneNightEnd)
        ) {
          onDateSelect?.(d, oneNightEnd);
        } else {
          clearSelection();
        }
        setTempEndDate(null);
        return;
      }

      // - If after/equal start -> extend inclusively to that day => end = d + 1
      const inclusiveEnd = addDays(d, 1);
      if (
        inclusiveEnd <= toMidnight(maxDate)! &&
        isRangeValid(start, inclusiveEnd)
      ) {
        onDateSelect?.(start, inclusiveEnd);
      } else {
        clearSelection();
      }
      setTempEndDate(null);
      return;
    }
  };

  /** Hover shows an inclusive preview: tempEnd = hover + 1 (if >= start) */
  const handleDateHover = (date: Date) => {
    const d = toMidnight(date)!;
    const start = toMidnight(selectedStartDate);
    const end = toMidnight(selectedEndDate);

    if (start && !end) {
      if (d < start) setTempEndDate(null);
      else setTempEndDate(addDays(d, 1));
    } else {
      setTempEndDate(null);
    }
  };

  /** Build month grid */
  const generateMonthDays = (): Date[][] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks: Date[][] = [];
    let week: Date[] = [];
    const startingDay = firstDay.getDay(); // 0 = Sun

    // Previous month tail
    for (let i = startingDay - 1; i >= 0; i--) {
      week.push(new Date(year, month, -i));
    }

    // Current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(new Date(year, month, day));
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    // Next month head
    if (week.length > 0) {
      const nextMonth = month + 1;
      let day = 1;
      while (week.length < 7) {
        week.push(new Date(year, nextMonth, day));
        day++;
      }
      weeks.push(week);
    }
    return weeks;
  };

  /** Compute visual state.
   * Note: we paint the "end" marker at (end - 1) so the UI shows the clicked tile.
   */
  const getDateState = (date: Date) => {
    const d = toMidnight(date)!;
    const start = toMidnight(selectedStartDate);
    const end = toMidnight(selectedEndDate); // internal exclusive end
    const temp = toMidnight(tempEndDate); // internal exclusive end (hover)

    const visualEnd = end ? addDays(end, -1) : null; // paint at clicked tile
    const visualTempEnd = temp ? addDays(temp, -1) : null; // paint at hovered tile

    const isDisabled = isDateDisabled(d);
    const isSelectedStart = start ? sameDay(d, start) : false;
    const isSelectedEnd = visualEnd ? sameDay(d, visualEnd) : false;

    const isInRange = !!start && !!visualEnd && d > start! && d < visualEnd!;

    const isTempInRange =
      !!start && !!visualTempEnd && !end && d > start! && d < visualTempEnd!;

    const isOtherMonth = d.getMonth() !== currentMonth.getMonth();
    const isToday = d.toDateString() === toMidnight(new Date())!.toDateString();

    return {
      isDisabled,
      isSelectedStart,
      isSelectedEnd,
      isInRange,
      isTempInRange,
      isToday,
      isOtherMonth,
    };
  };

  const weeks = generateMonthDays();

  // Nights indicator (for display under calendar)
  const nights =
    selectedStartDate && selectedEndDate
      ? Math.round(
          (toMidnight(selectedEndDate)!.getTime() -
            toMidnight(selectedStartDate)!.getTime()) /
            DAY_MS
        )
      : tempEndDate && selectedStartDate
      ? Math.round(
          (toMidnight(tempEndDate)!.getTime() -
            toMidnight(selectedStartDate)!.getTime()) /
            DAY_MS
        )
      : 0;

  const hasSelection = !!selectedStartDate && !!selectedEndDate;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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
        </button>

        <h3 className="grow text-center text-lg font-semibold text-gray-800">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        {/* Clear button shows only when a selection exists */}
        {hasSelection ? (
          <button
            onClick={clearSelection}
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Clear selection"
          >
            Clear
          </button>
        ) : (
          <span className="w-[64px]" aria-hidden="true"></span>
        )}

        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5 text-gray-600"
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

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIndex) => {
              const state = getDateState(date);
              const baseClasses =
                "w-full h-12 rounded-lg transition-all duration-200 font-medium text-sm";

              let stateClasses = "";
              if (state.isDisabled) {
                stateClasses = "bg-gray-100 text-gray-400 cursor-not-allowed";
              } else if (state.isSelectedStart || state.isSelectedEnd) {
                stateClasses =
                  "bg-blue-600 text-white hover:bg-blue-700 shadow-md";
              } else if (state.isInRange) {
                stateClasses = "bg-blue-100 text-blue-800 hover:bg-blue-200";
              } else if (state.isTempInRange) {
                stateClasses = "bg-blue-50 text-blue-700 hover:bg-blue-100";
              } else if (state.isOtherMonth) {
                stateClasses = "text-gray-400 hover:bg-gray-50";
              } else {
                stateClasses = "text-gray-700 hover:bg-gray-100";
              }

              const todayClasses = state.isToday
                ? "ring-2 ring-blue-400 ring-offset-2"
                : "";

              return (
                <button
                  key={dayIndex}
                  className={`${baseClasses} ${stateClasses} ${todayClasses}`}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => handleDateHover(date)}
                  disabled={state.isDisabled}
                  aria-pressed={
                    state.isSelectedStart ||
                    state.isSelectedEnd ||
                    state.isInRange
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Nights info + Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {nights > 0 ? (
              <span>
                <strong>{nights}</strong> night{nights > 1 ? "s" : ""}
              </span>
            ) : (
              <span>
                Press <kbd>Esc</kbd> to clear
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded" />
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded" />
              <span>In range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 rounded" />
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCalendar;
