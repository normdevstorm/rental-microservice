import { BlockedScheduleModel } from "../../../data/schedule/model/response/BlockedScheduleModel";

export interface CalendarProps {
  existingRentals: BlockedScheduleModel[];
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
  selectedStartDate?: Date | null;
  selectedEndDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
}
