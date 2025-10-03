import React from "react";
import { cls } from "../helpers/cls";

const Select: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
> = ({ className, error, children, ...props }) => (
  <div>
    <select
      className={cls(
        "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition bg-white",
        error
          ? "border-red-400 focus:ring-2 focus:ring-red-200"
          : "border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default Select;
