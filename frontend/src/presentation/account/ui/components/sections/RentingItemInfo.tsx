import React, { useState } from "react";
import RentingOutBookingTab from "../RentingOutBookingTab";
import MyItemsTab from "../MyItemsTab";
const RentingItemInfo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"items" | "bookings">("items");

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6 w-full overflow-x-hidden">
      <h2 className="text-2xl font-semibold text-gray-800">Quản lý cho thuê</h2>

      {/* Tab Slider */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "items"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("items")}
        >
          Xe của tôi
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "bookings"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-600"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          Lịch thuê
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "items" ? <MyItemsTab /> : <RentingOutBookingTab />}
    </div>
  );
};

export default RentingItemInfo;
