import React from "react";
import { CheckIcon, StarIcon } from "./CheckIcon";
import { PolicyItem } from "./PolicyItem";

/* -------------------------------- DetailsTabs ------------------------------- */
type DetailsTabsProps = {
  description?: string;
  features?: { label: string }[];
  policies?: { title: string; content: string }[];
  reviews?: { user: string; rating: number; comment: string; date: string }[];
  ratingSummary?: { average: number; count: number };
};
export const DetailsTabs: React.FC<DetailsTabsProps> = ({
  description,
  features = [],
  policies = [],
  reviews = [],
  ratingSummary,
}) => {
  const TABS = ["Mô tả", "Tính năng", "Chính sách", "Đánh giá"] as const;
  type TabKey = (typeof TABS)[number];
  const [active, setActive] = React.useState<TabKey>("Mô tả");

  return (
    <div className="mt-8 md:mt-10">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Chi tiết hạng mục"
        className="inline-flex rounded-2xl border border-black/10 bg-white p-1 shadow-sm"
      >
        {TABS.map((tab) => {
          const selected = active === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab}`}
              id={`tab-${tab}`}
              onClick={() => setActive(tab)}
              className={[
                "px-4 md:px-5 py-2 md:py-2.5 text-sm rounded-xl transition",
                selected
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-100",
              ].join(" ")}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="mt-5 md:mt-6">
        {/* MÔ TẢ */}
        {active === "Mô tả" && (
          <section
            role="tabpanel"
            id="panel-Mô tả"
            aria-labelledby="tab-Mô tả"
            className="rounded-2xl border border-black/10 bg-white p-5 md:p-6 shadow-sm"
          >
            <p className="text-[15px] leading-7 text-neutral-800 whitespace-pre-line">
              {description ??
                "Xe/vé được bảo dưỡng định kỳ, sạch sẽ trước khi giao. Phù hợp di chuyển nội thành, tiết kiệm nhiên liệu. Vui lòng mang theo CCCD/CMND khi nhận xe và tuân thủ quy định giao thông."}
            </p>
          </section>
        )}

        {/* TÍNH NĂNG */}
        {active === "Tính năng" && (
          <section
            role="tabpanel"
            id="panel-Tính năng"
            aria-labelledby="tab-Tính năng"
            className="rounded-2xl border border-black/10 bg-white p-5 md:p-6 shadow-sm"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {(features.length ? features : DEFAULT_FEATURES).map((f, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm shadow-sm"
                >
                  <CheckIcon className="text-emerald-500" />
                  <span className="text-neutral-800">{f.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CHÍNH SÁCH */}
        {active === "Chính sách" && (
          <section
            role="tabpanel"
            id="panel-Chính sách"
            aria-labelledby="tab-Chính sách"
            className="rounded-2xl border border-black/10 bg-white p-2 md:p-3 shadow-sm"
          >
            <div className="divide-y divide-black/10">
              {(policies.length ? policies : DEFAULT_POLICIES).map((p, idx) => (
                <PolicyItem key={idx} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* ĐÁNH GIÁ */}
        {active === "Đánh giá" && (
          <section
            role="tabpanel"
            id="panel-Đánh giá"
            aria-labelledby="tab-Đánh giá"
            className="rounded-2xl border border-black/10 bg-white p-5 md:p-6 shadow-sm"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-end gap-3">
                <div className="text-3xl font-semibold tracking-tight">
                  {ratingSummary?.average ?? 4.8}
                </div>
                <div className="text-sm text-neutral-600">
                  {ratingSummary?.count ?? 128} đánh giá
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    filled={i < Math.round(ratingSummary?.average ?? 4.8)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {(reviews.length ? reviews : DEFAULT_REVIEWS).map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.user}</div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <StarIcon key={k} filled={k < r.rating} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-[15px] leading-7 text-neutral-800">
                    {r.comment}
                  </p>
                  <div className="mt-2 text-xs text-neutral-500">{r.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
const DEFAULT_FEATURES = [
  { label: "Giao xe tận nơi" },
  { label: "Miễn phí mũ bảo hiểm" },
  { label: "Bảo hiểm cơ bản" },
  { label: "Hỗ trợ 24/7" },
  { label: "Tiết kiệm nhiên liệu" },
  { label: "Bảo dưỡng định kỳ" },
  { label: "Thanh toán linh hoạt" },
  { label: "Camera hành trình" },
];
const DEFAULT_POLICIES = [
  {
    title: "Giấy tờ khi nhận xe",
    content:
      "CCCD/CMND bản gốc và GPLX hợp lệ. Đặt cọc tuỳ dòng xe. Vui lòng kiểm tra tình trạng xe khi bàn giao.",
  },
  {
    title: "Chính sách nhiên liệu",
    content:
      "Nhận xe mức xăng nào, vui lòng hoàn trả cùng mức. Phí phát sinh tính theo thực tế nếu thiếu.",
  },
  {
    title: "Chính sách hủy",
    content:
      "Hủy trước 24h hoàn 100%. Trong 24h hoàn 50%. Không đến nhận xe (no-show) không hoàn.",
  },
];
const DEFAULT_REVIEWS = [
  {
    user: "Minh N.",
    rating: 5,
    comment: "Xe mới, chạy êm, chủ xe hỗ trợ nhiệt tình. Thủ tục nhanh gọn.",
    date: "12/08/2025",
  },
  {
    user: "Lan P.",
    rating: 4,
    comment: "Giao xe đúng giờ, giá hợp lý. Sẽ thuê lại khi có dịp.",
    date: "04/08/2025",
  },
];
