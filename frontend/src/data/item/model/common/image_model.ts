import { ImagePriorityType } from "../../../../common/types/enums/enums";

export interface ImageModel {
  id?: number;
  imageUrl: string;
  imageType: ImagePriorityType;
}
