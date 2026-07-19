import React, { useCallback, useState } from "react";
import CategoryTabs, { CategoryValue } from "../components/CategoryTabs";
import SearchFilterBar, { FilterValues } from "../components/SearchFilterBar";
import HomeItemSection from "../components/HomeItemSection";
import { ItemCategory } from "../../../../common/types/enums/enums";
// Reuse lightweight ItemCard type for now
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import { itemRepository } from "../../../../data/item/repository/item_respository";
import { useNavigate } from "react-router-dom"; // ✅ ensure this is react-router-dom
import { useQuery } from "react-query";

/** Simple Tailwind circular spinner */
const Spinner: React.FC<{ label?: string; className?: string }> = ({
  label,
  className,
}) => (
  <div className={`flex items-center justify-center ${className ?? "py-10"}`}>
    <div className="relative">
      {/* track */}
      <div className="h-10 w-10 rounded-full border-4 border-gray-200" />
      {/* animated arc */}
      <div className="absolute inset-0 h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
    </div>
    {label && <span className="ml-3 text-sm text-gray-600">{label}</span>}
  </div>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<CategoryValue>(ItemCategory.CAR);
  const [filters, setFilters] = useState<FilterValues>({});

  // Fetch vehicles by category using React Query
  const {
    data: vehicles = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<ItemResponse[], Error>(
    ["items", tab],
    () => itemRepository.getAllItemByCategory(tab),
    {
      // keep current list while fetching next tab -> less flicker
      keepPreviousData: true,
      staleTime: 60_000, // cache fresh for 1 minute
    }
  );

  const goSearch = useCallback(() => {
    const params = new URLSearchParams();
    params.set("category", tab.toLowerCase());
    if (filters.location) params.set("location", filters.location);
    if (filters.startDate) params.set("start", filters.startDate);
    if (filters.endDate) params.set("end", filters.endDate);
    navigate(`/search?${params.toString()}`);
  }, [navigate, tab, filters]);

  return (
    <div className="space-y-8">
      <div
        className="relative overflow-visible rounded-2xl shadow-xl bg-cover bg-center mx-3 md:mx-6 lg:mx-10 min-h-[500px]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.25)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop')",
        }}
      >
        <div className="relative text-center text-white px-7 md:px-12 pt-14 md:pt-24 pb-16 md:pb-24">
          <h1 className="text-[28px] md:text-[44px] font-extrabold leading-tight drop-shadow-md">
            Mioto - Cùng Bạn Trên Mọi Hành Trình
          </h1>
          <p className="text-white/90 text-base md:text-lg mt-2">
            Trải nghiệm sự khác biệt từ <strong>hơn 10.000</strong> xe gia đình
            đời mới khắp Việt Nam
          </p>
        </div>

        {/* Tabs + Search filter bar */}
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-10 flex flex-col items-center"
          style={{ width: "min(100% - 24px, 760px)" }}
        >
          <div className="inline-block bg-white rounded-xl shadow-xl px-2.5 py-1.5">
            <CategoryTabs value={tab} onChange={setTab} />
          </div>
          <div className="mt-1 w-full">
            <SearchFilterBar
              values={filters}
              onChange={setFilters}
              onFind={goSearch}
            />
          </div>
        </div>
      </div>

      {/* Spacer below hero */}
      <div className="h-16 md:h-20" />

      {/* Error state */}
      {isError && (
        <div className="mx-3 md:mx-6 lg:mx-10 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">
            Không thể tải danh sách xe. Vui lòng thử lại.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Loading state: circular progress */}
      {(isLoading || isFetching) && (
        <Spinner label="Đang tải xe..." className="mx-3 md:mx-6 lg:mx-10" />
      )}

      {/* List when data is ready */}
      {!isLoading && !isError && (
        <HomeItemSection
          title={
            tab === ItemCategory.CAR ? "Xe ô tô nổi bật" : "Xe máy nổi bật"
          }
          items={vehicles ?? []}
          onItemClick={(id) => navigate(`/item/${id}`)}
        />
      )}
    </div>
  );
};

export default HomePage;
