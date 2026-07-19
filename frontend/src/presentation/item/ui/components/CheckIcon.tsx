import React from "react";

/* ---------------------------------- Icons --------------------------------- */

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
    </svg>
  );
}

export function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      className={filled ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-amber-500"}
      strokeWidth={filled ? 0 : 1.8}
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
