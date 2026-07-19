import React from "react";

const SectionCard: React.FC<
  React.PropsWithChildren<{ title: string; subtitle?: string }>
> = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-emerald-900/10 bg-white p-5 shadow-sm">
    <h3 className="mb-1 text-base font-semibold text-emerald-900">{title}</h3>
    {subtitle && <p className="mb-4 text-sm text-neutral-600">{subtitle}</p>}
    <div className="space-y-4">{children}</div>
  </section>
);

export default SectionCard;
