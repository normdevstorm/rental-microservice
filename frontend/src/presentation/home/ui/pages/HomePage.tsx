import React, { useEffect, useMemo, useState } from "react";
import CategoryTabs, { CategoryValue } from "../components/CategoryTabs";
import SearchFilterBar, { FilterValues } from "../components/SearchFilterBar";
import HomeItemSection from "../components/HomeItemSection";
import { ItemCategory } from "../../../../common/types/enums/enums";
// Reuse lightweight ItemCard type for now
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import { itemRepository } from "../../../../data/item/repository/item_respository";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";
// import { useQuery } from "@tanstack/react-query";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<CategoryValue>(ItemCategory.CAR);
  const [filters, setFilters] = useState<FilterValues>({});

  const fetchCars = async () => {
    const carRes = await itemRepository.getAllItemByCategory(ItemCategory.CAR);
    return carRes;
  };

  const fetchMotorbikes = async () => {
    const motorbikeRes = await itemRepository.getAllItemByCategory(
      ItemCategory.MOTORBIKE
    );
    return motorbikeRes;
  };

  const { data: cachedCars } = useQuery<ItemResponse[], Error>({
    queryKey: ["cachedCars"],
    queryFn: fetchCars,
  });

  const { data: cachedMotorbikes } = useQuery<ItemResponse[], Error>({
    queryKey: ["cachedMotorbikes"],
    queryFn: fetchMotorbikes,
  });

  const currentList = useMemo(
    () => (tab === ItemCategory.CAR ? cachedCars : cachedMotorbikes),
    [tab, cachedCars, cachedMotorbikes]
  );

  const goSearch = () => {
    const params = new URLSearchParams();
    params.set("category", tab.toLowerCase());
    if (filters.location) params.set("location", filters.location);
    if (filters.startDate) params.set("start", filters.startDate);
    if (filters.endDate) params.set("end", filters.endDate);
    navigate(`/search?${params.toString()}`);
  };

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
      <div className="h-16 md:h-20" />

      <HomeItemSection
        title={tab === ItemCategory.CAR ? "Xe ô tô nổi bật" : "Xe máy nổi bật"}
        items={currentList ?? []}
        onItemClick={(id) => navigate(`/item/${id}`)}
      />
      <HomeItemSection
        title={tab === ItemCategory.CAR ? "Xe máy nổi bật" : "Xe ô tô nổi bật"}
        items={(tab === ItemCategory.CAR ? cachedMotorbikes : cachedCars) ?? []}
        onItemClick={(id) => navigate(`/item/${id}`)}
      />
    </div>
  );
};

export default HomePage;
