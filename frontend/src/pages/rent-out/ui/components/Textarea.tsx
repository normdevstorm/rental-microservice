import React from "react";
import { cls } from "../helpers/cls";

const Textarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
> = ({ className, error, ...props }) => (
  <div>
    <textarea
      className={cls(
        "mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
        error
          ? "border-red-400 focus:ring-2 focus:ring-red-200"
          : "border-neutral-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
        className
      )}
      rows={4}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default Textarea;
