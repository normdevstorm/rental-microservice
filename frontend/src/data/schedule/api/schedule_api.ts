import { axiosInstance } from "../../../common/services/axios";
import { ApiResponse } from "../../common/ApiResponse";
import { BlockedScheduleModel } from "../model/response/BlockedScheduleModel";

class ScheduleApi {
  private static instance: ScheduleApi;

  public static getInstance(): ScheduleApi {
    if (!ScheduleApi.instance) {
      ScheduleApi.instance = new ScheduleApi();
    }
    return ScheduleApi.instance;
  }

  async getBlockedSchedule(
    itemId: string
  ): Promise<ApiResponse<BlockedScheduleModel[]>> {
    try {
      const params = new URLSearchParams();
      params.append("itemId", itemId);
      const response = await axiosInstance.get<
        ApiResponse<BlockedScheduleModel[]>
      >("/bookings/schedule", { params });
      return response.data;
    } catch (error) {
      console.log("Error fetching blocked schedules of itemId " + itemId);
      throw error;
    }
  }
}

export const scheduleApi = ScheduleApi.getInstance();
