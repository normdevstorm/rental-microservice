// src/features/schedule/api/ScheduleApi.mock.ts
import { ApiResponse } from "../../common/ApiResponse";
import { BlockedScheduleModel } from "../model/response/BlockedScheduleModel";

export interface IScheduleApi {
  getBlockedSchedule(
    itemId: string
  ): Promise<ApiResponse<BlockedScheduleModel[]>>;
}

/** ===== Helpers: build all-day (date-only) ranges relative to "today" in UTC ===== */

const startOfTodayUTC = () => {
  const now = new Date();
  // return new Date(
  //   Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  // );
  return now; // Use local date for simplicity in mock
};
const addDaysUTC = (base: Date, days: number) => {
  const d = new Date(base);
  // d.setUTCDate(d.getUTCDate() + days);
  d.setDate(d.getDate() + days);
  return d;
};
const toISODateOnly = (d: Date) => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

// If you must emit midnight timestamps instead of date-only, set this to true.
const EMIT_MIDNIGHT_ISO = false;
/** Convert "YYYY-MM-DD" to "YYYY-MM-DDT00:00:00.000Z" if needed */
export const emitAllDay = (dateOnly: string) =>
  EMIT_MIDNIGHT_ISO ? `${dateOnly}T00:00:00.000Z` : dateOnly;

/** Short form to get a date-only string offset by N days from today (UTC) */
const T0 = startOfTodayUTC();
const d = (offset: number) => toISODateOnly(addDaysUTC(T0, offset));

/** Build an all-day range */
const range = (
  startOffset: number,
  endOffset: number
): BlockedScheduleModel => ({
  startTime: emitAllDay(d(startOffset)),
  endTime: emitAllDay(d(endOffset)),
});

/** ===== In-memory all-day mock DB =====
 * Notes:
 * - All entries are date-only (or midnight ISO if EMIT_MIDNIGHT_ISO=true).
 * - End date is **inclusive** (e.g., 2025-09-28 → 2025-09-30 blocks 3 days).
 * - Includes overlaps, touching ranges, empty sets, past/future, long ranges, etc.
 */
const MOCK_DB: Record<string, BlockedScheduleModel[]> = {
  // Mixed but all all‑day
  "item-001": [range(1, 2), range(3, 5), range(7, 8), range(9, 10)],

  // Past + single day + next week
  "item-002": [range(-2, -1), range(2, 2), range(10, 12)],

  // Overlaps (merging logic test)
  "item-overlap": [range(4, 7), range(6, 9), range(6, 6)],

  // Touching ranges (no gaps if you treat inclusive end)
  "item-touching": [range(1, 3), range(4, 6)],

  // Long continuous (~1 month)
  "item-long-range": [range(0, 30)],

  // Weekend-ish patterns (relative to today)
  "item-weekend": [range(5, 6), range(12, 13)],

  // Likely crosses month boundary
  "item-month-end": [range(25, 35)],

  // Scattered single days
  "item-scattered": [range(1, 1), range(2, 2), range(3, 3), range(5, 5)],

  // Past only
  "item-past": [range(-14, -10), range(-7, -7)],

  // Far future
  "item-future": [range(45, 50), range(60, 61)],

  // Same-day duplicates (to test dedup/stacking), plus another day
  "item-one-day-multi": [range(4, 4), range(4, 4), range(6, 6)],

  // Formerly time-mix, now all-day adjacent days
  "item-time-mix": [range(2, 2), range(3, 3)],

  // Explicit empty
  "item-empty": [],

  // More well-formed examples
  "item-003": [range(8, 9), range(15, 15)],
  "item-004": [range(0, 0)], // today
  "item-005": [range(20, 27)], // 1-week

  // New bigger sets
  "item-q4-campaign": [range(70, 100)], // multi-week
  "item-holidays": [range(95, 98), range(120, 121)], // two holiday windows
  "item-ends-today": [range(-2, 0)], // ends today
  "item-starts-today-3days": [range(0, 2)], // starts today, lasts 3 days
};

/** Simulated network delay */
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export class ScheduleApiMock implements IScheduleApi {
  async getBlockedSchedule(
    itemId: string
  ): Promise<ApiResponse<BlockedScheduleModel[]>> {
    await delay();

    // Hard error (exception) to test catch block
    if (itemId === "error" || itemId === "throw") {
      throw new Error("Mock 500: failed to load blocked schedule");
    }

    // Soft/business error with HTTP 200
    if (itemId === "fail") {
      return {
        data: [],
        message: "Business rule: item is disabled",
        code: "ITEM_DISABLED",
        success: false,
      };
    }

    const data = MOCK_DB[itemId] ?? [];

    return {
      data,
      message: "OK (mock, all-day)",
      code: "OK",
      success: true,
    };
  }
}

export const mockScheduleApi = new ScheduleApiMock();

// Export DB for tests if needed
export const __mockDb = MOCK_DB;
