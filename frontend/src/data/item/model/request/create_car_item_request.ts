import { FuelType, TransmissionEnumType } from "../../../../common/types/enums/enums";
import { ImageModel } from "../common/image_model";
import { ItemCommonModel } from "../common/item_common_model";

export interface CreateCarItemRequest{
    id?: number;
    brand: string;
    model: string;
    year: number;
    transmission: string;
    fuelType: string;
    seats: number;
    licensePlate: string;
    kms: number;
    item: ItemCommonModel;
    itemImages: ImageModel[];
}