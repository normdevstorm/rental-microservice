import React from "react";
import { cls } from "../helpers/cls";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div>
    <input
      ref={ref}
      className={cls(
        "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
        error
          ? "border-red-400 focus:ring-2 focus:ring-red-200"
          : "border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";

export default Input;
