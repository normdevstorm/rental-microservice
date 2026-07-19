import { ItemResponse } from "../../../data/item/model/response/item_response";

export interface ItemCardProps {
  /**
   * The item data to be displayed in the card
   */
  item: ItemResponse;

  /**
   * Optional click handler for the card
   */
  onClick?: (item: ItemResponse) => void;

  /**
   * Whether to show the discount badge
   * @default false
   */
  showDiscount?: boolean;

  /**
   * Whether to show the lightning badge
   * @default true
   */
  showLightningBadge?: boolean;

  /**
   * Additional CSS class name to apply to the component
   */
  className?: string;

  /**
   * The discount percentage to display
   * @default 14
   */
  discountPercent?: number;

  /**
   * The original price before discount
   * @default "1.170K"
   */
  originalPrice?: string | number;
}
