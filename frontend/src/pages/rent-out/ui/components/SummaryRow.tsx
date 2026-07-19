import React from "react";

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-3 text-sm">
      <div className="text-neutral-600">{label}</div>
      <div className="text-neutral-900">{value}</div>
    </div>
  );
}

export default SummaryRow;
