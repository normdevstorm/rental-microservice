import React, { useEffect, useMemo, useRef, useState } from "react";
import { ItemCategory } from "../../../../common/types/enums/enums";
import { CarIcon, MotorbikeIcon } from "../../../../common/components/Icons";

export type CategoryValue =
  | typeof ItemCategory.CAR
  | typeof ItemCategory.MOTORBIKE;

interface Props {
  value: CategoryValue;
  onChange: (val: CategoryValue) => void;
}

const CategoryTabs: React.FC<Props> = ({ value, onChange }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLButtonElement>(null);
  const bikeRef = useRef<HTMLButtonElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const activeRef = useMemo(
    () => (value === ItemCategory.CAR ? carRef : bikeRef),
    [value]
  );

  const recalc = () => {
    const wrap = wrapRef.current;
    const el = activeRef.current;
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const left = elRect.left - wrapRect.left;
    setIndicator({ left, width: elRect.width });
  };

  useEffect(() => {
    recalc();
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const base =
    "px-4 py-2.5 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 select-none";
  const active = "bg-emerald-50 text-emerald-700";
  const inactive = "bg-transparent text-gray-600 hover:bg-gray-50";

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center gap-2 px-2 py-2 rounded-full bg-white/10 backdrop-blur"
    >
      {/* sliding underline */}
      <span
        className="pointer-events-none absolute bottom-0 h-[3px] bg-emerald-500 rounded-full transition-all duration-300"
        style={{
          left: indicator.left + 6,
          width: Math.max(0, indicator.width - 12),
        }}
      />

      <button
        ref={carRef}
        type="button"
        className={`${base} ${value === ItemCategory.CAR ? active : inactive}`}
        onClick={() => onChange(ItemCategory.CAR)}
      >
        <CarIcon /> Ô tô
      </button>
      <button
        ref={bikeRef}
        type="button"
        className={`${base} ${
          value === ItemCategory.MOTORBIKE ? active : inactive
        }`}
        onClick={() => onChange(ItemCategory.MOTORBIKE)}
      >
        <MotorbikeIcon /> Xe máy
      </button>
    </div>
  );
};

export default CategoryTabs;
