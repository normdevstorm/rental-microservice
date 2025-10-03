import { CarItem } from "../../../data/item/model/common/car_item";
import { MotorbikeItem } from "../../../data/item/model/common/motorbike_item";

/**
 * Type guard to check if an item is a motorbike
 * item is ItemMotorbike: This is a type predicate. If the function returns true, TypeScript will treat item as an ItemMotorbike type from that point onward.
 */

export function isMotorbikeItem(item: unknown): item is MotorbikeItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "engineCapacity" in item &&
    "licensePlate" in item
  );
}

/**
 * Type guard to check if an item is a car
 */
export function isCarItem(item: unknown): item is CarItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "seats" in item &&
    // "doors" in item &&
    !("engineCapacity" in item)
  );
}
