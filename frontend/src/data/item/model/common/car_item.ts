import { FuelType } from "../../../../common/types/enums/enums";

export interface CarItem {
  id?: number;
  itemId?: number;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  transmission: string;
  seats: number;
  licensePlate: string;
  kms?: number;
}
