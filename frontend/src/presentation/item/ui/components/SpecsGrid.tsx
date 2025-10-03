import React from "react";
import { Spec } from "../pages/ItemDetailPage";

export function LocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* --------------------------------- Specs --------------------------------- */
export const SpecsGrid: React.FC<{
  modelName: string;
  address: string;
  specsTopRow: Spec[];
  specsBottomRow: Spec[];
}> = ({ modelName, address, specsTopRow, specsBottomRow }) => {
  const SpecRow = ({ specs }: { specs: Spec[] }) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5">
      {specs.map((s, i) => (
        <div
          key={`${s.label}-${i}`}
          className="rounded-2xl border border-black/10 bg-white p-4 md:p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="text-[11px] uppercase tracking-wide text-gray-500">
            {s.label}
          </div>
          <div className="mt-1.5 text-sm font-medium text-gray-900">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {modelName}
        </h1>
        <p className="mt-1.5 flex items-center gap-2 text-gray-600">
          <LocationIcon className="text-gray-400" /> {address}
        </p>
      </div>
      <SpecRow specs={specsTopRow} />
      <SpecRow specs={specsBottomRow} />
    </section>
  );
};
