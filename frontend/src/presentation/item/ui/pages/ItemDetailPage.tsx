// src/pages/ItemDetailPage.tsx
import React, { useCallback, useEffect, useState } from "react";
import { BookingOptionsCard } from "../components/BookingOptionsCard";
import { ItemGallery } from "../components/ItemGallery";
import { SpecsGrid } from "../components/SpecsGrid";
import { DetailsTabs } from "../components/DetailsTabs";
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import {
  isCarItem,
  isMotorbikeItem,
} from "../../../../common/types/guards/type_guards";
import { itemRepository } from "../../../../data/item/repository/item_respository";
import { useParams } from "react-router-dom";
import { useGlobalAlert } from "../../../../common/components/AlertDialog/AlertProvider";
import { useAppSelector } from "../../../../store";
import { UserResponse } from "../../../../data/user/model/response/user_response";
import { ToggleButton } from "react-bootstrap";
import { AvailabilityStatus } from "../../../../common/types/enums/enums";
import { ImagePriority } from "../../../../common/types/enums/enums";

export type Spec = { label: string; value: string };

export const currencyFormat = (value: number, currency = "VND") =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(value);

/* ---------------------------------- Page --------------------------------- */
export const ItemDetailPage: React.FC = () => {
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const [isActive, setIsActive] = useState(true);

  const currentUserInfo: UserResponse = useAppSelector(
    (state) => state.auth.user!
  );

  const itemId = Number(id);

  const onBook = (payload: { startDate: string; endDate: string }) => {
    console.log("Booked:", payload);
    return;
  };
  const alertDialog = useGlobalAlert();

  const handleUpdateStatus = async () => {
    const newStatus = isActive ? "UNAVAILABLE" : "AVAILABLE";

    try {
      await itemRepository.updateItemStatus(itemId, newStatus);
      alertDialog.notify("Đã cập nhật trạng thái thành công!");
      setIsActive(!isActive); // cập nhật trạng thái nút
    } catch (error: any) {
      alertDialog.error(error?.message || "Cập nhật trạng thái thất bại.");
    }
  };

  const fetchItem = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await itemRepository.getItemById(itemId);
      setItem(response);
    } catch (err) {
      console.error("Error fetching item:", err);
      setError("Failed to load item. Please try again.");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (item) {
      setIsActive(item.availabilityStatus == AvailabilityStatus.AVAILABLE);
    }
  }, [item]);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const response = await itemRepository.getItemById(itemId);
        if (!canceled) setItem(response);
        console.log("Item owner", item);
      } catch (err) {
        if (!canceled) setError("Failed to load item. Please try again.");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  // Loading skeleton to avoid first-render crashes/splash
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 antialiased">
        <div className="animate-pulse">
          <div className="h-[360px] w-full bg-gray-100" />
          <section className="w-full">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-8 py-10 lg:py-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-8 w-2/3 bg-gray-100 rounded" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-16 bg-gray-100 rounded" />
                    <div className="h-16 bg-gray-100 rounded" />
                    <div className="h-16 bg-gray-100 rounded" />
                  </div>
                  <div className="h-64 bg-gray-100 rounded" />
                </div>
                <div className="lg:col-span-1">
                  <div className="h-72 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchItem}
            className="mt-4 inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Guard if item didn’t load but no explicit error
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900">
        <p className="text-gray-600">No item found.</p>
      </div>
    );
  }

  let modelName = "";
  let specsTopRow: Spec[] = [];
  let specsBottomRow: Spec[] = [];
  const currency = "VND";

  if (item?.itemDetail) {
    if (isMotorbikeItem(item.itemDetail)) {
      modelName = item.itemDetail.model;
      specsTopRow = [
        { label: "Brand", value: item.itemDetail.brand },
        { label: "Year", value: item.itemDetail.year.toString() },
        { label: "License", value: item.itemDetail.licensePlate },
      ];
      specsBottomRow = [
        {
          label: "Engine",
          value: item.itemDetail.engineCapacity.toString() + "cc",
        },
        { label: "Transmission", value: item.itemDetail.transmission },
        { label: "Fuel", value: item.itemDetail.fuelType },
      ];
    } else if (isCarItem(item.itemDetail)) {
      modelName = item.itemDetail.model;
      specsTopRow = [
        { label: "Brand", value: item.itemDetail.brand },
        { label: "Year", value: item.itemDetail.year.toString() },
        { label: "License", value: item.itemDetail.licensePlate },
      ];
      specsBottomRow = [
        { label: "Seats", value: item.itemDetail.seats.toString() },
        { label: "Transmission", value: item.itemDetail.transmission },
        { label: "Fuel", value: item.itemDetail.fuelType },
      ];
    }
  }

  const images: string[] =
    item?.itemImages
      ?.filter((u) => u.imageType !== ImagePriority.DOCUMENT)
      .map((u) => u.imageUrl) ?? [];
  console.log("Item", item);
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* SECTION 1: GALLERY */}
      {images.length > 0 ? (
        <ItemGallery images={images} modelName={modelName} />
      ) : (
        <div className="h-[360px] w-full bg-gray-100" />
      )}

      {/* SECTION 2 */}
      <section className="w-full">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Right: Model, address, specs */}{" "}
            <div className="lg:col-span-2">
              {item.owner?.id === currentUserInfo?.id && (
                <button
                  onClick={handleUpdateStatus}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {isActive ? "Đang hoạt động" : "Không hoạt động"}
                </button>
              )}
              <SpecsGrid
                modelName={modelName}
                address={item?.address ?? ""}
                specsTopRow={specsTopRow}
                specsBottomRow={specsBottomRow}
              />

              <DetailsTabs
                description={item?.description ?? "No description available."}
                features={[
                  { label: "Giao xe tận nơi" },
                  { label: "Bảo hiểm cơ bản" },
                  { label: "Mũ bảo hiểm kèm theo" },
                  { label: "Hỗ trợ 24/7" },
                  { label: "Camera hành trình" },
                  { label: "Thanh toán linh hoạt" },
                ]}
                policies={[
                  {
                    title: "Giấy tờ khi nhận xe",
                    content:
                      "CCCD/CMND và GPLX hợp lệ. Đặt cọc theo quy định từng dòng xe. Kiểm tra xe khi nhận.",
                  },
                  {
                    title: "Chính sách hủy",
                    content:
                      "Hủy trước 24h hoàn 100%, trong 24h hoàn 50%, no-show không hoàn.",
                  },
                ]}
                reviews={[
                  {
                    user: "Minh N.",
                    rating: 5,
                    comment: "Xe mới, chạy êm, chủ xe hỗ trợ nhiệt tình.",
                    date: "12/08/2025",
                  },
                  {
                    user: "Lan P.",
                    rating: 4,
                    comment: "Giao xe đúng giờ, giá tốt. Sẽ quay lại.",
                    date: "04/08/2025",
                  },
                ]}
                ratingSummary={{ average: 4.8, count: 128 }}
              />
            </div>
            {/* Left: Booking card */}
            {/* Hide booking card if owner is viewing */}
            {item.owner?.id !== currentUserInfo?.id && (
              <div className="lg:col-span-1">
                <BookingOptionsCard
                  itemId={item.id}
                  pricePerDay={item?.price ?? 0}
                  currency={currency}
                  onBook={onBook}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
