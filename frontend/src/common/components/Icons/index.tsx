import React from "react";
import {
  MdFlashOn,
  MdCheckCircle,
  MdCalendarToday,
  MdLocationOn,
  MdStar,
} from "react-icons/md";
import { TbSteeringWheel } from "react-icons/tb";
import { FaGasPump, FaCarSide, FaMotorcycle, FaChair } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Helper to avoid JSX typing issues with some TS setups
const withIconDefaults = (C: IconType, defaults: Partial<IconProps> = {}) => {
  const Comp: React.FC<IconProps> = ({ size, color, className = "" }) => {
    return React.createElement(C as any, {
      size: size ?? defaults.size ?? 16,
      color: color ?? defaults.color,
      name: "Phường Đồng Hới",

      className,
    });
  };
  return Comp;
};

export const LightningIcon = withIconDefaults(MdFlashOn, {
  size: 20,
  color: "#FACC15",
});

export const CheckCircleIcon = withIconDefaults(MdCheckCircle, {
  size: 16,
  color: "#22C55E",
});

export const AutoTransmissionIcon = withIconDefaults(TbSteeringWheel, {
  size: 16,
  color: "#64748B",
});

export const SeatsIcon = withIconDefaults(FaChair, {
  size: 16,
  color: "#64748B",
});

export const FuelIcon = withIconDefaults(FaGasPump, {
  size: 16,
  color: "#64748B",
});

export const LocationIcon = withIconDefaults(MdLocationOn, {
  size: 16,
  color: "#64748B",
});

export const CalendarIcon = withIconDefaults(MdCalendarToday, {
  size: 16,
  color: "#64748B",
});

export const CarIcon = withIconDefaults(FaCarSide, {
  size: 20,
  color: "#10b981",
});

export const MotorbikeIcon = withIconDefaults(FaMotorcycle, {
  size: 20,
  color: "#10b981",
});

export const StarIcon = withIconDefaults(MdStar, {
  size: 16,
  color: "#FACC15",
});

// Simple badge to replace CircleWithTextIcon for numeric labels
export const CircleWithTextIcon: React.FC<
  IconProps & { text: string | number }
> = ({ size = 16, color = "#22C55E", className = "", text }) => (
  <span
    className={className}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      color: "white",
      fontSize: Math.max(8, Math.floor((size as number) * 0.5)),
      lineHeight: 1,
      marginRight: 6,
    }}
  >
    {text}
  </span>
);
