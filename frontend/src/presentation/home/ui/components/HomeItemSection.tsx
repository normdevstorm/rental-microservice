import React from "react";
import ItemCard from "../../../../common/components/ItemCard";

// use lightweight item type from account mock for ItemCard compatibility
import { ItemResponse as CardItem } from "../../../../data/item/model/response/item_response";
interface Props {
  title: string;
  items: CardItem[];
  onItemClick?: (id: number) => void;
}

const HomeItemSection: React.FC<Props> = ({ title, items, onItemClick }) => {
  return (
    <section className="mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-4 md:mb-6">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight pb-1">
            {title}
          </h3>
        </div>
        {items.length === 0 ? (
          <div className="text-gray-500 italic">Không có dữ liệu.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it) => (
              <li key={it.id} className="flex justify-center">
                <ItemCard item={it} onClick={() => onItemClick?.(it.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HomeItemSection;
