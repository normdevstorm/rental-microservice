import { ApiResponse } from "../../common/ApiResponse";
import {
  AvailabilityStatus,
  AvailabilityStatusType,
  FuelEnum,
  FuelType,
  ImagePriority,
  ItemCategory,
  ItemCategoryType,
} from "../../../common/types/enums/enums";
import { ImageModel } from "../model/common/image_model";
import { ItemResponse } from "../model/response/item_response";

// Helpers
export const makeApiResponse = <T>(
  data: T,
  message = "OK",
  success = true,
  code = "200"
): ApiResponse<T> => ({ data, message, code, success });

const now = (daysAgo = 0) =>
  new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

const img = (id: number, url: string, main = false): ImageModel => ({
  id,
  imageUrl: url,
  imageType: main ? ImagePriority.MAIN : ImagePriority.EXTRA,
});

// Car items helpers
const makeCarItem = (p: {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  latePrice: number;
  deposit: number;
  address: string;
  rating?: number;
  value: number;
  fuel: FuelType;
  transmission?: string;
  seats: number;
  plate: string;
  kms?: number;
  doors?: number;
  daysAgo?: number;
  images?: string[];
}): ItemResponse => ({
  id: p.id,
  name: p.name,
  description: `${p.brand} ${p.model} ${p.year}`,
  price: p.price,
  latePrice: p.latePrice,
  depositAmount: p.deposit,

  address: p.address,
  conditionRating: p.rating ?? 4.6,
  availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
  createdAt: now(p.daysAgo ?? 2),
  itemValue: p.value,
  category: ItemCategory.CAR as ItemCategoryType,
  itemImages: (
    p.images ?? [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    ]
  ).map((u, idx) => img(p.id * 10 + idx, u, idx === 0)),
  itemDetail: {
    brand: p.brand,
    model: p.model,
    year: p.year,
    fuelType: p.fuel,
    transmission: p.transmission ?? "AT",
    seats: p.seats,
    licensePlate: p.plate,
    kms: p.kms ?? 20000,
    // extra field to satisfy car guard used elsewhere
    doors: p.doors ?? 4,
  },
});

// Car items
export const mockCarItems: ItemResponse[] = [
  {
    id: 101,
    name: "Toyota Vios 2022",
    description: "Xe gia đình tiết kiệm, phù hợp đô thị",
    price: 45,
    latePrice: 65,
    depositAmount: 500,

    address: "Quận 1, TP. Hồ Chí Minh",
    conditionRating: 4.7,
    availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
    createdAt: now(2),
    itemValue: 18000,
    category: ItemCategory.CAR as ItemCategoryType,
    itemImages: [
      img(
        1,
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
        true
      ),
      img(
        2,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
      ),
    ],
    itemDetail: {
      brand: "Toyota",
      model: "Vios",
      year: 2022,
      fuelType: FuelEnum.PETROL as FuelType,
      transmission: "AT",
      seats: 5,
      licensePlate: "51A-123.45",
      kms: 24000,
      // extra field to satisfy car guard used elsewhere
      doors: 4,
    },
  },
  {
    id: 102,
    name: "Mazda CX-5 2021",
    description: "SUV 5 chỗ tiện nghi, rộng rãi",
    price: 75,
    latePrice: 95,
    depositAmount: 800,

    address: "Cầu Giấy, Hà Nội",
    conditionRating: 4.9,
    availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
    createdAt: now(5),
    itemValue: 32000,
    category: ItemCategory.CAR as ItemCategoryType,
    itemImages: [
      img(
        3,
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop",
        true
      ),
      img(
        4,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
      ),
    ],
    itemDetail: {
      brand: "Mazda",
      model: "CX-5",
      year: 2021,
      fuelType: FuelEnum.PETROL as FuelType,
      transmission: "AT",
      seats: 5,
      licensePlate: "30G-567.89",
      kms: 31000,
      doors: 5,
    },
  },
  {
    id: 103,
    name: "VinFast VF e34",
    description: "Crossover điện, êm ái và tiết kiệm",
    price: 60,
    latePrice: 85,
    depositAmount: 700,

    address: "Thủ Đức, TP. Hồ Chí Minh",
    conditionRating: 4.6,
    availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
    createdAt: now(7),
    itemValue: 28000,
    category: ItemCategory.CAR as ItemCategoryType,
    itemImages: [
      img(
        5,
        "https://images.unsplash.com/photo-1606151962340-e646806bc487?q=80&w=1200&auto=format&fit=crop",
        true
      ),
    ],
    itemDetail: {
      brand: "VinFast",
      model: "VF e34",
      year: 2023,
      fuelType: FuelEnum.ELECTRIC as FuelType,
      transmission: "AT",
      seats: 5,
      licensePlate: "51K-345.67",
      kms: 12000,
      doors: 5,
    },
  },
  makeCarItem({
    id: 104,
    name: "Kia Morning 2020",
    brand: "Kia",
    model: "Morning",
    year: 2020,
    price: 28,
    latePrice: 40,
    deposit: 300,
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    rating: 4.3,
    value: 12000,
    fuel: FuelEnum.PETROL as FuelType,
    seats: 5,
    plate: "51F-456.78",
    kms: 42000,
    doors: 5,
    daysAgo: 4,
  }),
  makeCarItem({
    id: 105,
    name: "Hyundai Accent 2021",
    brand: "Hyundai",
    model: "Accent",
    year: 2021,
    price: 40,
    latePrice: 58,
    deposit: 500,
    address: "Hai Bà Trưng, Hà Nội",
    rating: 4.7,
    value: 17000,
    fuel: FuelEnum.PETROL as FuelType,
    seats: 5,
    plate: "30H-112.23",
    kms: 26000,
    doors: 4,
    daysAgo: 6,
  }),
  makeCarItem({
    id: 106,
    name: "Honda City 2022",
    brand: "Honda",
    model: "City",
    year: 2022,
    price: 42,
    latePrice: 60,
    deposit: 500,
    address: "Nha Trang, Khánh Hòa",
    rating: 4.6,
    value: 18000,
    fuel: FuelEnum.PETROL as FuelType,
    seats: 5,
    plate: "79A-678.90",
    kms: 18000,
    doors: 4,
    daysAgo: 8,
  }),
  makeCarItem({
    id: 107,
    name: "Toyota Fortuner 2019",
    brand: "Toyota",
    model: "Fortuner",
    year: 2019,
    price: 85,
    latePrice: 110,
    deposit: 900,
    address: "Đống Đa, Hà Nội",
    rating: 4.5,
    value: 38000,
    fuel: FuelEnum.DIESEL as FuelType,
    seats: 7,
    plate: "30A-999.99",
    kms: 52000,
    doors: 5,
    daysAgo: 10,
  }),
  makeCarItem({
    id: 108,
    name: "Ford Ranger 2020",
    brand: "Ford",
    model: "Ranger",
    year: 2020,
    price: 90,
    latePrice: 120,
    deposit: 1000,
    address: "Thủ Dầu Một, Bình Dương",
    rating: 4.6,
    value: 42000,
    fuel: FuelEnum.DIESEL as FuelType,
    seats: 5,
    plate: "61C-123.45",
    kms: 45000,
    doors: 4,
    daysAgo: 12,
  }),
  makeCarItem({
    id: 109,
    name: "Mercedes C200 2020",
    brand: "Mercedes",
    model: "C200",
    year: 2020,
    price: 140,
    latePrice: 180,
    deposit: 1500,
    address: "Quận 7, TP. Hồ Chí Minh",
    rating: 4.9,
    value: 60000,
    fuel: FuelEnum.PETROL as FuelType,
    seats: 5,
    plate: "51G-777.77",
    kms: 30000,
    doors: 4,
    daysAgo: 14,
  }),
  makeCarItem({
    id: 110,
    name: "Tesla Model 3 2023",
    brand: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 180,
    latePrice: 220,
    deposit: 2000,
    address: "Quận 1, TP. Hồ Chí Minh",
    rating: 4.8,
    value: 80000,
    fuel: FuelEnum.ELECTRIC as FuelType,
    seats: 5,
    plate: "51K-2023.03",
    kms: 8000,
    doors: 4,
    daysAgo: 1,
    images: [
      "https://images.unsplash.com/photo-1511396275275-5a3c6f37c9a0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200&auto=format&fit=crop",
    ],
  }),
];

// Motorbike items
const makeBikeItem = (p: {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  latePrice: number;
  deposit: number;
  address: string;
  rating?: number;
  value: number;
  transmission: string;
  engine: number;
  fuel: FuelType;
  plate: string;
  kms?: number;
  daysAgo?: number;
  images?: string[];
}): ItemResponse => ({
  id: p.id,
  name: p.name,
  description: `${p.brand} ${p.model} ${p.year}`,
  price: p.price,
  latePrice: p.latePrice,
  depositAmount: p.deposit,

  address: p.address,
  conditionRating: p.rating ?? 4.5,
  availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
  createdAt: now(p.daysAgo ?? 2),
  itemValue: p.value,
  category: ItemCategory.MOTORBIKE as ItemCategoryType,
  itemImages: (
    p.images ?? [
      "https://images.unsplash.com/photo-1583001804187-74c05ec163e8?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570018144715-431103e2a5a9?q=80&w=1200&auto=format&fit=crop",
    ]
  ).map((u, idx) => img(p.id * 10 + idx, u, idx === 0)),
  itemDetail: {
    brand: p.brand,
    model: p.model,
    year: p.year,
    transmission: p.transmission,
    engineCapacity: p.engine,
    fuelType: p.fuel,
    licensePlate: p.plate,
    kms: p.kms ?? 4000,
  },
});

export const mockMotorbikeItems: ItemResponse[] = [
  {
    id: 201,
    name: "Honda CBR650R",
    description: "Sport-bike mạnh mẽ cho cuối tuần",
    price: 35,
    latePrice: 50,
    depositAmount: 300,

    address: "Q. 3, TP. Hồ Chí Minh",
    conditionRating: 4.8,
    availabilityStatus:
      AvailabilityStatus.UNAVAILABLE as AvailabilityStatusType,
    createdAt: now(1),
    itemValue: 9000,
    category: ItemCategory.MOTORBIKE as ItemCategoryType,
    itemImages: [
      img(
        11,
        "https://images.unsplash.com/photo-1583001804187-74c05ec163e8?q=80&w=1200&auto=format&fit=crop",
        true
      ),
      img(
        12,
        "https://images.unsplash.com/photo-1570018144715-431103e2a5a9?q=80&w=1200&auto=format&fit=crop"
      ),
    ],
    itemDetail: {
      brand: "Honda",
      model: "CBR650R",
      year: 2024,
      transmission: "Manual",
      engineCapacity: 649,
      fuelType: FuelEnum.PETROL as FuelType,
      licensePlate: "59A1-650.65",
      kms: 1500,
    },
  },
  {
    id: 202,
    name: "Yamaha NVX 155",
    description: "Tay ga đô thị linh hoạt",
    price: 12,
    latePrice: 18,
    depositAmount: 100,

    address: "Thanh Xuân, Hà Nội",
    conditionRating: 4.5,
    availabilityStatus:
      AvailabilityStatus.UNAVAILABLE as AvailabilityStatusType,
    createdAt: now(3),
    itemValue: 2500,
    category: ItemCategory.MOTORBIKE as ItemCategoryType,
    itemImages: [
      img(
        13,
        "https://images.unsplash.com/photo-1558981852-426c6c22a72f?q=80&w=1200&auto=format&fit=crop",
        true
      ),
    ],
    itemDetail: {
      brand: "Yamaha",
      model: "NVX 155",
      year: 2022,
      transmission: "CVT",
      engineCapacity: 155,
      fuelType: FuelEnum.PETROL as FuelType,
      licensePlate: "29L1-155.29",
      kms: 8000,
    },
  },
  {
    id: 203,
    name: "VinFast Klara S",
    description: "Xe máy điện thời trang",
    price: 10,
    latePrice: 16,
    depositAmount: 120,

    address: "Hải Châu, Đà Nẵng",
    conditionRating: 4.4,
    availabilityStatus: AvailabilityStatus.AVAILABLE as AvailabilityStatusType,
    createdAt: now(9),
    itemValue: 2000,
    category: ItemCategory.MOTORBIKE as ItemCategoryType,
    itemImages: [
      img(
        14,
        "https://images.unsplash.com/photo-1602589099965-4f7b4a6943b9?q=80&w=1200&auto=format&fit=crop",
        true
      ),
    ],
    itemDetail: {
      brand: "VinFast",
      model: "Klara S",
      year: 2023,
      transmission: "Automatic",
      engineCapacity: 0,
      fuelType: FuelEnum.ELECTRIC as FuelType,
      licensePlate: "43K1-888.88",
      kms: 4000,
    },
  },
  makeBikeItem({
    id: 204,
    name: "Honda SH 150i",
    brand: "Honda",
    model: "SH 150i",
    year: 2021,
    price: 20,
    latePrice: 28,
    deposit: 200,
    address: "Phú Nhuận, TP. Hồ Chí Minh",
    value: 4500,
    transmission: "CVT",
    engine: 150,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "59S1-150.15",
    kms: 9000,
    daysAgo: 5,
  }),
  makeBikeItem({
    id: 205,
    name: "Yamaha Exciter 155",
    brand: "Yamaha",
    model: "Exciter 155",
    year: 2022,
    price: 16,
    latePrice: 24,
    deposit: 150,
    address: "Thủ Đức, TP. Hồ Chí Minh",
    value: 3000,
    transmission: "Manual",
    engine: 155,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "51B1-155.55",
    kms: 7000,
    daysAgo: 6,
  }),
  makeBikeItem({
    id: 206,
    name: "Suzuki Raider 150",
    brand: "Suzuki",
    model: "Raider 150",
    year: 2020,
    price: 14,
    latePrice: 20,
    deposit: 120,
    address: "Cần Thơ",
    value: 2500,
    transmission: "Manual",
    engine: 150,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "65B1-150.06",
    kms: 12000,
    daysAgo: 8,
  }),
  makeBikeItem({
    id: 207,
    name: "Piaggio Vespa Sprint",
    brand: "Piaggio",
    model: "Vespa Sprint",
    year: 2019,
    price: 18,
    latePrice: 26,
    deposit: 180,
    address: "Đà Nẵng",
    value: 4000,
    transmission: "CVT",
    engine: 150,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "43H1-678.90",
    kms: 16000,
    daysAgo: 9,
  }),
  makeBikeItem({
    id: 208,
    name: "VinFast Feliz S",
    brand: "VinFast",
    model: "Feliz S",
    year: 2023,
    price: 12,
    latePrice: 18,
    deposit: 120,
    address: "Hải Phòng",
    value: 2200,
    transmission: "Automatic",
    engine: 0,
    fuel: FuelEnum.ELECTRIC as FuelType,
    plate: "15K1-2023.01",
    kms: 3000,
    daysAgo: 11,
  }),
  makeBikeItem({
    id: 209,
    name: "Honda Winner X",
    brand: "Honda",
    model: "Winner X",
    year: 2021,
    price: 15,
    latePrice: 22,
    deposit: 140,
    address: "Biên Hòa",
    value: 2800,
    transmission: "Manual",
    engine: 150,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "60B1-150.19",
    kms: 11000,
    daysAgo: 12,
  }),
  makeBikeItem({
    id: 210,
    name: "Yamaha Grande",
    brand: "Yamaha",
    model: "Grande",
    year: 2022,
    price: 13,
    latePrice: 19,
    deposit: 110,
    address: "Quận 10, TP. Hồ Chí Minh",
    value: 2300,
    transmission: "CVT",
    engine: 125,
    fuel: FuelEnum.PETROL as FuelType,
    plate: "59N1-125.13",
    kms: 6000,
    daysAgo: 2,
  }),
];

export const mockAllItems: ItemResponse[] = [
  ...mockCarItems,
  ...mockMotorbikeItems,
];

// Predefined API responses for testing
export const mockGetAllCarsResponse: ApiResponse<ItemResponse[]> =
  makeApiResponse(mockCarItems, "OK", true, "200");
export const mockGetAllMotorbikesResponse: ApiResponse<ItemResponse[]> =
  makeApiResponse(mockMotorbikeItems, "OK", true, "200");
export const mockGetAllItemsResponse: ApiResponse<ItemResponse[]> =
  makeApiResponse(mockAllItems, "OK", true, "200");
export const mockGetItemByIdResponse: Record<
  number,
  ApiResponse<ItemResponse>
> = Object.fromEntries(
  mockAllItems.map((i) => [i.id, makeApiResponse(i, "OK", true, "200")])
);
