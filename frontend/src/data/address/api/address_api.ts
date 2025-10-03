import {
  axiosAddressInstance,
  axiosInstance,
} from "../../../common/services/axios";
import { ApiResponse } from "../../common/ApiResponse";
import { AddressResponse } from "../model/response/address_response";

class AddressApi {
  private static instance: AddressApi;

  private constructor() {}

  public static getInstance(): AddressApi {
    if (!AddressApi.instance) {
      AddressApi.instance = new AddressApi();
    }
    return AddressApi.instance;
  }

  async getAllAddresses(searchText: string): Promise<AddressResponse[]> {
    try {
      const params = new URLSearchParams({
        format: "json",
        addressdetails: "0",
        limit: "10",
        "accept-language": "vi",
        q: searchText,
      });
      const response = await axiosAddressInstance.get<AddressResponse[]>(
        "/search",
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  }
}

export const addressApi = AddressApi.getInstance();
