import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchFilterBar, { FilterValues } from "../components/SearchFilterBar";
import HomeItemSection from "../components/HomeItemSection";
import { ItemCategory } from "../../../../common/types/enums/enums";
import { Tag } from "antd";
import CategoryTabs, { CategoryValue } from "../components/CategoryTabs";
import { ItemResponse as CardItem } from "../../../../data/item/model/response/item_response";
import { itemRepository } from "../../../../data/item/repository/item_respository";

const SearchResultsPage: React.FC = () => {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();

  const initialCategory = (sp.get("category")?.toUpperCase() ||
    ItemCategory.CAR) as CategoryValue;
  const [tab, setTab] = useState<CategoryValue>(initialCategory);

  const [filters, setFilters] = useState<FilterValues>({
    location: sp.get("location") || undefined,
    startDate: sp.get("start") || undefined,
    endDate: sp.get("end") || undefined,
  });

  const [items, setItems] = useState<CardItem[]>([]);

  const refetch = async () => {
    const res = await itemRepository.filterItemByAddressCategoryAndDateRange(
      (filters.location ?? "").toLowerCase(),
      tab,
      filters.startDate ? new Date(filters.startDate) : new Date(),
      filters.endDate ? new Date(filters.endDate) : new Date()
    );
    const mapped = (res || []).map((it: any) => ({
      ...it,
      imageUrl: it.imageUrl?.[0]?.imageUrl,
      createdAt: new Date(),
    }));
    // simple client-side filtering for now by address
    // const addr = filters.location?.toLowerCase();
    // const filtered = addr
    //   ? mapped.filter((i) => i.address?.toLowerCase().includes(addr))
    //   : mapped;
    setItems(mapped);
  };

  useEffect(() => {
    refetch();
    // sync url
    const params = new URLSearchParams();
    params.set("category", tab.toLowerCase());
    if (filters.location) params.set("location", filters.location);
    if (filters.startDate) params.set("start", filters.startDate);
    if (filters.endDate) params.set("end", filters.endDate);
    setSp(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, filters.location, filters.startDate, filters.endDate]);

  const chips = useMemo(() => {
    const arr: React.ReactNode[] = [];
    if (filters.location)
      arr.push(
        <Tag key="loc" color="blue">
          {filters.location}
        </Tag>
      );
    if (filters.startDate && filters.endDate)
      arr.push(
        <Tag key="date" color="green">
          Ngày thuê
        </Tag>
      );
    return arr;
  }, [filters]);

  return (
    <div className="space-y-4">
      <CategoryTabs value={tab} onChange={setTab} />
      <SearchFilterBar
        values={filters}
        onChange={setFilters}
        onFind={refetch}
      />
      {/* <div className="flex gap-2 items-center">{chips}</div> */}
      <HomeItemSection
        title="Kết quả tìm kiếm"
        items={items}
        onItemClick={(id) => navigate(`/item/${id}`)}
      />
    </div>
  );
};

export default SearchResultsPage;
