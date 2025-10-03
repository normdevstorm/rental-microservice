import { mockScheduleApi } from "../api/mock_schedule_api";
import { scheduleApi } from "../api/schedule_api";
import { BlockedScheduleModel } from "../model/response/BlockedScheduleModel";

class ScheduleRepository {
  private static instance: ScheduleRepository;

  public static getInstance(): ScheduleRepository {
    if (!ScheduleRepository.instance) {
      ScheduleRepository.instance = new ScheduleRepository();
    }
    return ScheduleRepository.instance;
  }

  async getBlockedSchedule({
    itemId,
  }: {
    itemId: string;
  }): Promise<BlockedScheduleModel[]> {
    const params = new URLSearchParams();
    params.append("itemId", itemId);
    const response = await scheduleApi.getBlockedSchedule(itemId);
    // const response = await mockScheduleApi.getBlockedSchedule(itemId);
    return response.data;
  }
}

export const scheduleRepository = ScheduleRepository.getInstance();
