import React from "react";
import styles from "./styles.module.scss";
import { ItemCardProps } from "./ItemCardProps";
import { ITEM_CARD_CONSTANTS } from "./constants";
import {
  LightningIcon,
  CheckCircleIcon,
  AutoTransmissionIcon,
  SeatsIcon,
  FuelIcon,
  LocationIcon,
  StarIcon,
  CircleWithTextIcon,
} from "../Icons";
import { ItemCategory } from "../../types/enums/enums";
import { CarItem } from "../../../data/item/model/common/car_item";
import { MotorbikeItem } from "../../../data/item/model/common/motorbike_item";
import { formatThousands } from "../../../pages/rent-out/ui/components/CurrencyInput";

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  showDiscount = true,
  showLightningBadge = true,
  className = "",
  discountPercent = ITEM_CARD_CONSTANTS.DEFAULT_DISCOUNT_PERCENT,
  originalPrice = ITEM_CARD_CONSTANTS.DEFAULT_ORIGINAL_PRICE,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div className={`${styles.itemCard} ${className}`} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img
          src={
            item.itemImages.at(0)?.imageUrl ||
            ITEM_CARD_CONSTANTS.DEFAULT_NO_IMAGE
          }
          alt={item.name}
          className={styles.image}
        />
        {/* Discount badge
        {showDiscount && (
          <span className={styles.discountBadge}>Giảm {discountPercent}%</span>
        )} */}
        {/* Lightning icon */}
        {showLightningBadge && (
          <span className={styles.lightningBadge}>
            <LightningIcon />
          </span>
        )}
      </div>
      <div className={styles.depositTag}>
        <CheckCircleIcon />
        {ITEM_CARD_CONSTANTS.LABELS.NO_DEPOSIT}
      </div>
      <div className={styles.title}>{item.name}</div>
      <div className={styles.specRow}>
        {(() => {
          const fuelLabel = (ft?: string) => {
            switch (ft) {
              case "PETROL":
                return ITEM_CARD_CONSTANTS.SPECS.FUEL_GASOLINE;
              case "DIESEL":
                return ITEM_CARD_CONSTANTS.SPECS.FUEL_DIESEL;
              case "ELECTRIC":
                return ITEM_CARD_CONSTANTS.SPECS.FUEL_ELECTRIC;
              case "HYBRID":
                return ITEM_CARD_CONSTANTS.SPECS.FUEL_HYBRID;
              default:
                return undefined;
            }
          };

          const transLabel = (t?: string) =>
            /auto/i.test(t ?? "")
              ? ITEM_CARD_CONSTANTS.SPECS.AUTOMATIC
              : ITEM_CARD_CONSTANTS.SPECS.MANUAL;

          if (item.category === ItemCategory.CAR) {
            const d = (item.itemDetail as CarItem) || ({} as CarItem);
            const seatsText = d?.seats ? `${d.seats} chỗ` : undefined;
            return (
              <>
                <span className={styles.specItem}>
                  <AutoTransmissionIcon />
                  {transLabel(d?.transmission)}
                </span>
                <span className={styles.specItem}>
                  <SeatsIcon />
                  {seatsText ?? ITEM_CARD_CONSTANTS.SPECS.SEATS_5}
                </span>
                <span className={styles.specItem}>
                  <FuelIcon />
                  {fuelLabel(String(d?.fuelType)) ??
                    ITEM_CARD_CONSTANTS.SPECS.FUEL_GASOLINE}
                </span>
              </>
            );
          }

          if (item.category === ItemCategory.MOTORBIKE) {
            const d =
              (item.itemDetail as MotorbikeItem) || ({} as MotorbikeItem);
            return (
              <>
                <span className={styles.specItem}>
                  <AutoTransmissionIcon />
                  {transLabel(d?.transmission)}
                </span>
                <span className={styles.specItem}>
                  <CircleWithTextIcon text={d?.engineCapacity ?? ""} />
                  {d?.engineCapacity ? `${d.engineCapacity}cc` : "Engine"}
                </span>
                <span className={styles.specItem}>
                  <FuelIcon />
                  {fuelLabel(String(d?.fuelType)) ??
                    ITEM_CARD_CONSTANTS.SPECS.FUEL_GASOLINE}
                </span>
              </>
            );
          }

          // Fallback (unknown category)
          return (
            <>
              <span className={styles.specItem}>
                <AutoTransmissionIcon />
                {ITEM_CARD_CONSTANTS.SPECS.AUTOMATIC}
              </span>
              <span className={styles.specItem}>
                <SeatsIcon />
                {ITEM_CARD_CONSTANTS.SPECS.SEATS_5}
              </span>
              <span className={styles.specItem}>
                <FuelIcon />
                {ITEM_CARD_CONSTANTS.SPECS.FUEL_GASOLINE}
              </span>
            </>
          );
        })()}
      </div>
      <div className={styles.locationRow}>
        <LocationIcon />
        {item.address}
      </div>{" "}
      <div className={styles.ratingRow}>
        <span className={`${styles.ratingItem} ${styles.starRating}`}>
          <StarIcon />
          {item.conditionRating || 5.0}
        </span>

        <span className={styles.price}>
          { formatThousands(item.price.toString())}
          {ITEM_CARD_CONSTANTS.LABELS.PRICE_PER_DAY}
        </span>
      </div>
    </div>
  );
};
export default ItemCard;
