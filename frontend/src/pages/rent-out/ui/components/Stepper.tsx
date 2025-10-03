import { cls } from "../helpers/cls";

const steps = [
  { key: 0, label: "Thông tin xe" },
  { key: 1, label: "Ảnh & mô tả" },
  { key: 2, label: "Giá & lịch" },
  { key: 3, label: "Xem lại & đăng" },
] as const;

function Stepper({
  current,
  onJump,
}: {
  current: number;
  onJump?: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((s, i) => {
        const active = i === current;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => onJump?.(i)}
            className={cls(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-emerald-900/10 bg-white text-neutral-700 hover:bg-emerald-50"
            )}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs">
              {i + 1}
            </span>
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export default Stepper;
