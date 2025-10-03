import React from "react";
import { ShieldIcon } from "./CheckIcon";

/* ------------------------------ Policy item ------------------------------ */

export const PolicyItem: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="p-3 md:p-4">
      <button
        className="flex w-full items-center justify-between gap-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-[15px] font-medium">
          <ShieldIcon className="text-neutral-400" />
          {title}
        </div>
        <svg
          className={[
            "h-5 w-5 text-neutral-500 transition-transform",
            open ? "rotate-180" : "",
          ].join(" ")}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div className="mt-2 text-[15px] leading-7 text-neutral-700">
          {content}
        </div>
      )}
    </div>
  );
};
