import { FuelType } from "../../../../common/types/enums/enums";

export interface MotorbikeItem {
  id?: number;
  itemId?: number;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  engineCapacity: number;
  fuelType: FuelType;
  licensePlate: string;
  kms?: number;
}
