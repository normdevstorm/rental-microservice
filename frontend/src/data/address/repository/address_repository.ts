import { addressApi } from "../api/address_api";
import { AddressResponse } from "../model/response/address_response";

class AddressRepository {
  private static instance: AddressRepository;

  private constructor() {}

  public static getInstance(): AddressRepository {
    if (!AddressRepository.instance) {
      AddressRepository.instance = new AddressRepository();
    }
    return AddressRepository.instance;
  }

  async getAllAddresses(searchText: string): Promise<AddressResponse[]> {
    const response = await addressApi.getAllAddresses(searchText);
    return response;
  }
}

export const addressRepository = AddressRepository.getInstance();
