import React, { useEffect, useState } from "react";
import { ItemCategory } from "../../../../common/types/enums/enums";
import ItemCard from "../../../../common/components/ItemCard";
import { itemRepository } from "../../../../data/item/repository/item_respository";
import { ItemResponse } from "../../../../data/item/model/response/item_response";
import { use } from "i18next";
import { useNavigate } from "react-router";

const MyItemsTab: React.FC = () => {
  const [vehicleType, setVehicleType] = useState("Ô tô");
  const [filteredItems, setFilteredItems] = useState<ItemResponse[]>([]);

  // Map UI type to enum value
  const typeMap: Record<string, string | undefined> = {
    "Ô tô": ItemCategory.CAR,
    "Xe máy": ItemCategory.MOTORBIKE,
  };

  const fetchItems = async () => {
    const result = await itemRepository.getAllMyItems(
    );

const response = result.filter(
  (item) => typeMap[vehicleType] === item.category
);

    setFilteredItems(response || []);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleType]);

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Loại xe</h3>
      <div className="flex gap-3">
        {["Ô tô", "Xe máy"].map((type) => (
          <button
            key={type}
            onClick={() => setVehicleType(type)}
            className={`px-4 py-1 rounded border ${
              vehicleType === type
                ? "bg-green-600 text-white border-green-600"
                : "hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            Không có xe nào được cho thuê.
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <li key={item.id} className="flex justify-center">
                <ItemCard
                  item={item}
                  onClick={(item) => navigate(`/item/${item.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyItemsTab;
