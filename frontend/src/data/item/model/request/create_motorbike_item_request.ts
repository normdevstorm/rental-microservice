import {
  FuelType,
  TransmissionEnumType,
} from "../../../../common/types/enums/enums";
import { ImageModel } from "../common/image_model";
import { ItemCommonModel } from "../common/item_common_model";

export interface CreateMotorbikeItemRequest {
  id?: number;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  fuelType: string;
  kms: number;
  engineCapacity: number;
  licensePlate: string;
  item: ItemCommonModel;
  itemImages: ImageModel[];
}
