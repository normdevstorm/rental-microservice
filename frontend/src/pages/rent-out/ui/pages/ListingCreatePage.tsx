// src/pages/ListingCreatePage.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionCard from "../components/SectionCard";
import Label from "../components/Label";
import Input from "../components/Input";
import Select from "../components/Select";
import Textarea from "../components/Textarea";
import SummaryRow from "../components/SummaryRow";
import { cls } from "../helpers/cls";
import Stepper from "../components/Stepper";
import { useNavigate } from "react-router";
import React, { useEffect } from "react";
import { itemRepository } from "../../../../data/item/repository/item_respository";
import {
  ItemCategory,
  type ItemCategoryType,
  FuelEnum,
  type FuelType,
  TransmissionEnum,
  type TransmissionEnumType,
  ImagePriority,
} from "../../../../common/types/enums/enums";
import { ItemCommonModel } from "../../../../data/item/model/common/item_common_model";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import { format, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import AddressSearchBox from "../components/SearchBox";
import { AddressResponse } from "../../../../data/address/model/response/address_response";
import { addressRepository } from "../../../../data/address/repository/address_repository";
import CurrencyInput from "../components/CurrencyInput";
import { ImageModel } from "../../../../data/item/model/common/image_model";
import { useGlobalAlert } from "../../../../common/components/AlertDialog/AlertProvider";

// Register Vietnamese locale for react-datepicker
registerLocale("vi", vi);

// ---------------- Types & Constants ----------------
// Derive local vehicle type from global ItemCategory type without duplicating literals
type VehicleType = Lowercase<Extract<ItemCategoryType, "CAR" | "MOTORBIKE">>;

type ListingForm = {
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  transmission: "" | TransmissionEnumType;
  fuel: "" | FuelType;
  seats: string; // car only
  engineCC: string; // motorbike only
  address: string;
  pickupNotes: string;
  kms: string;
  description: string;
  features: string[];
  images: string[]; // data URLs
  // Newly added certificate / document images (registration, insurance, etc.)
  certificateImages: string[]; // data URLs
  pricePerDay: string;
  deposit: string;
  itemValue: string;
  latePrice: string;
  availableFrom: string;
  availableTo: string;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  acceptTerms: boolean;
};

type FormsByType = Record<VehicleType, ListingForm>;

const STORAGE_KEY_V2 = "listing-create-draft-v2";
// Add one more step (certificate uploads) -> previous final review becomes step 4
const TOTAL_STEPS = 5;

const TRANSMISSIONS = Object.values(TransmissionEnum) as TransmissionEnumType[];
const FUELS = Object.values(FuelEnum) as FuelType[];
const FEATURES = [
  "Giao xe tận nơi",
  "Mũ bảo hiểm kèm theo",
  "Bảo hiểm cơ bản",
  "Hỗ trợ 24/7",
  "Camera hành trình",
  "Bluetooth/USB",
  "GHế trẻ em (ô tô)",
  "Box/Thùng đồ (xe máy)",
];

const DEFAULT_FORM: ListingForm = {
  vehicleType: "motorbike",
  brand: "",
  model: "",
  year: "",
  licensePlate: "",
  transmission: "",
  fuel: "",
  seats: "",
  engineCC: "",
  address: "",
  pickupNotes: "",
  kms: "",
  description: "",
  features: [],
  images: [],
  certificateImages: [],
  pricePerDay: "",
  deposit: "",
  itemValue: "",
  latePrice: "",
  availableFrom: "",
  availableTo: "",
  cancellationPolicy: "moderate",
  acceptTerms: false,
};

const DEFAULT_FORMS: FormsByType = {
  motorbike: { ...DEFAULT_FORM, vehicleType: "motorbike" },
  car: { ...DEFAULT_FORM, vehicleType: "car" },
};

// ---------------- Helpers ----------------
const currencyFormat = (value: number, currency = "VND") =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(
    isFinite(value) ? value : 0
  );

function readFilesAsDataURLs(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.readAsDataURL(file);
        })
    )
  );
}

// Date helpers: store as ISO (yyyy-MM-dd), display as dd/MM/yyyy
const toDate = (s: string) => {
  try {
    return s ? parseISO(s) : null;
  } catch {
    return null;
  }
};
const toISO = (d: Date | null) => (d ? format(d, "yyyy-MM-dd") : "");

function loadDraft(): { activeType: VehicleType; forms: FormsByType } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2);
    if (raw) {
      const parsed = JSON.parse(raw);
      const activeType: VehicleType =
        parsed?.activeType === "car" || parsed?.activeType === "motorbike"
          ? parsed.activeType
          : "motorbike";
      const forms: FormsByType = {
        car: {
          ...DEFAULT_FORMS.car,
          ...(parsed?.forms?.car ?? {}),
          vehicleType: "car",
        },
        motorbike: {
          ...DEFAULT_FORMS.motorbike,
          ...(parsed?.forms?.motorbike ?? {}),
          vehicleType: "motorbike",
        },
      };
      return { activeType, forms };
    }
  } catch {
    // ignore
  }
  return { activeType: "motorbike", forms: DEFAULT_FORMS };
}
// ...

export default function ListingCreatePage() {
  // State: per-type forms + activeType
  const [{ activeType, forms }, setState] = React.useState(loadDraft);
  const form = forms[activeType];
  const navigate = useNavigate();
  const alertDialog = useGlobalAlert();

  // Errors, step, submitting
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  // Helpers: update active form; switch active type
  const setActiveType = (t: VehicleType) =>
    setState((s) => ({ ...s, activeType: t }));

  const updateForm = (
    patch: Partial<ListingForm> | ((current: ListingForm) => ListingForm)
  ) =>
    setState((s) => {
      const curr = s.forms[s.activeType];
      const next =
        typeof patch === "function" ? patch(curr) : { ...curr, ...patch };
      // Keep vehicleType locked to the active type
      next.vehicleType = s.activeType;
      return { ...s, forms: { ...s.forms, [s.activeType]: next } };
    });

  // Persist drafts (both) + which type is active
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify({ activeType, forms }));
  }, [activeType, forms]);

  /* ----------------------------- Validation -------------------------------- */

  function validate(currentStep = step) {
    const e: Record<string, string> = {};

    if (currentStep === 0) {
      if (!form.brand.trim()) e.brand = "Vui lòng nhập hãng xe";
      if (!form.model.trim()) e.model = "Vui lòng nhập mẫu xe";
      if (!form.year.trim()) e.year = "Năm SX?";
      if (form.vehicleType === "car" && !form.seats) e.seats = "Số chỗ?";
      if (form.vehicleType === "motorbike" && !form.engineCC)
        e.engineCC = "Dung tích (cc)?";
      if (!form.transmission) e.transmission = "Hộp số?";
      if (!form.fuel) e.fuel = "Nhiên liệu?";
      if (!form.address.trim()) e.address = "Địa chỉ nhận/trả xe?";
    }
    if (currentStep === 1) {
      if (form.images.length < 1) e.images = "Tối thiểu 1 ảnh";
      if (!form.description.trim()) e.description = "Mô tả ngắn gọn xe";
    }

    if (currentStep === 2) {
      const price = Number(form.pricePerDay);
      if (!form.pricePerDay) e.pricePerDay = "Giá thuê là bắt buộc?";
      if (!form.deposit) e.deposit = "Giá cọc là bắt buộc?";
      else if (!(price > 0)) e.pricePerDay = "Giá phải > 0";
    }
    if (currentStep === 3) {
      // Certificate images step
      if (form.certificateImages.length < 1)
        e.certificateImages = "Cần tối thiểu 1 ảnh giấy tờ";
    }
    if (currentStep === 4) {
      if (!form.acceptTerms)
        e.acceptTerms = "Bạn cần đồng ý điều khoản trước khi đăng";
    }
    setErrors(e);
    return e;
  }

  function next() {
    const e = validate(step);
    if (Object.keys(e).length === 0)
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit() {
    const eStep4 = validate(4);
    const eStep3 = validate(3);
    const eStep2 = validate(2);
    const eStep1 = validate(1);
    if (
      Object.keys(eStep4).length > 0 ||
      Object.keys(eStep3).length > 0 ||
      Object.keys(eStep1).length > 0 ||
      Object.keys(eStep2).length > 0
    ) {
      alertDialog.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSubmitting(true);

    try {
      // Submit only the active form
      const payload = forms[activeType];
      let createResponse: any = undefined;

      let commonData: ItemCommonModel = {
        name: form.brand + " " + form.model,
        price: Number(payload.pricePerDay) || 0,
        depositAmount: Number(payload.deposit) || 0,
        itemValue: Number(payload.itemValue) || 0,
        latePrice: Number(payload.latePrice) || 0,
        address: payload.address,
        category: ItemCategory.MOTORBIKE,
        description: payload.description,
      };

      // TODO: Replace with your API call
      if (activeType == "car") {
        commonData.category = ItemCategory.CAR;
        createResponse = await itemRepository.createCarItem({
          model: payload.model,
          brand: payload.brand,
          fuelType: payload.fuel,
          // itemImages: payload.images,
          licensePlate: payload.licensePlate,
          seats: Number(payload.seats) || 0,
          year: Number(payload.year),
          transmission: payload.transmission,
          kms: Number(payload.kms),
          item: commonData,
          itemImages: [
            // Main & extra vehicle images
            ...form.images.map((image, index) => {
              const imageModel: ImageModel = {
                imageUrl: image,
                imageType:
                  index == 0 ? ImagePriority.MAIN : ImagePriority.EXTRA,
              };
              return imageModel;
            }),
            // Certificate/document images
            ...form.certificateImages.map((image) => {
              const imageModel: ImageModel = {
                imageUrl: image,
                imageType: ImagePriority.DOCUMENT,
              };
              return imageModel;
            }),
          ],
        });
      } else {
        createResponse = await itemRepository.createMotorbikeItem({
          model: payload.model,
          brand: payload.brand,
          engineCapacity: Number(payload.engineCC),
          // itemImages: payload.images,
          licensePlate: payload.licensePlate,
          year: Number(payload.year),
          fuelType: payload.fuel,
          kms: Number(payload.kms),
          item: commonData,
          itemImages: [
            ...form.images.map((image, index) => {
              const imageModel: ImageModel = {
                imageUrl: image,
                imageType:
                  index == 0 ? ImagePriority.MAIN : ImagePriority.EXTRA,
              };
              return imageModel;
            }),
            ...form.certificateImages.map((image) => {
              const imageModel: ImageModel = {
                imageUrl: image,
                imageType: ImagePriority.DOCUMENT,
              };
              return imageModel;
            }),
          ],
          transmission: payload.transmission,
        });
      }
      console.log(createResponse);
      await new Promise((r) => setTimeout(r, 900));
      alertDialog.notify("🎉 Tạo listing thành công!");

      // Clear only the active draft; keep the other draft intact
      setState((s) => ({
        ...s,
        forms: { ...s.forms, [activeType]: DEFAULT_FORMS[activeType] },
      }));

      // If you want to clear both drafts instead, use:
      // setState({ activeType: "motorbike", forms: DEFAULT_FORMS });
      // localStorage.removeItem(STORAGE_KEY_V2);
      setStep(0);
      navigate("/account/my-items");
    } catch (err) {
      alertDialog.error("Có lỗi khi tạo listing. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  const fetchAddresses = async (
    q: string,
    signal?: AbortSignal
  ): Promise<AddressResponse[]> => {
    await new Promise((r) => setTimeout(r, 300));

    const response = await addressRepository.getAllAddresses(q);
    return response;
  };

  /* -------------------------------- Render --------------------------------- */

  return (
    <div className="min-h-screen bg-emerald-50 text-neutral-900">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6">
          <Stepper current={step} onJump={(i) => setStep(i)} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="space-y-6 lg:col-span-2">
            {step === 0 && (
              <SectionCard title="Thông tin phương tiện">
                {/* Vehicle type */}
                <div>
                  <Label>Loại xe</Label>
                  <div className="mt-2 inline-flex rounded-xl border border-emerald-900/10 bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setActiveType("motorbike")}
                      className={cls(
                        "rounded-lg px-4 py-2 text-sm",
                        activeType === "motorbike"
                          ? "bg-emerald-700 text-white"
                          : "text-neutral-700 hover:bg-emerald-50"
                      )}
                    >
                      Xe máy
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveType("car")}
                      className={cls(
                        "rounded-lg px-4 py-2 text-sm",
                        activeType === "car"
                          ? "bg-emerald-700 text-white"
                          : "text-neutral-700 hover:bg-emerald-50"
                      )}
                    >
                      Ô tô
                    </button>
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <Label htmlFor="brand">Hãng</Label>
                  <Input
                    id="brand"
                    placeholder="VD: Honda, Toyota..."
                    value={form.brand}
                    onChange={(e) => updateForm({ brand: e.target.value })}
                    error={errors.brand}
                  />
                </div>

                {/* Model */}
                <div>
                  <Label htmlFor="model">Mẫu xe</Label>
                  <Input
                    id="model"
                    placeholder="VD: Vision, Vios..."
                    value={form.model}
                    onChange={(e) => updateForm({ model: e.target.value })}
                    error={errors.model}
                  />
                </div>

                {/* Year / licensePlate */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="year">Năm sản xuất</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="VD: 2021"
                      value={form.year}
                      onChange={(e) => updateForm({ year: e.target.value })}
                      error={errors.year}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">Biển số</Label>
                    <Input
                      id="licensePlate"
                      placeholder=""
                      value={form.licensePlate}
                      onChange={(e) =>
                        updateForm({ licensePlate: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Transmission / Fuel */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Hộp số</Label>
                    <Select
                      value={form.transmission}
                      onChange={(e) =>
                        updateForm({
                          transmission: e.target.value as TransmissionEnumType,
                        })
                      }
                      error={errors.transmission}
                    >
                      <option value="">Chọn hộp số</option>
                      {TRANSMISSIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Nhiên liệu</Label>
                    <Select
                      value={form.fuel}
                      onChange={(e) =>
                        updateForm({ fuel: e.target.value as FuelType })
                      }
                      error={errors.fuel}
                    >
                      <option value="">Chọn nhiên liệu</option>
                      {FUELS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Seats / Engine CC */}
                {form.vehicleType === "car" && (
                  <div>
                    <Label htmlFor="seats">Số chỗ</Label>
                    <Input
                      id="seats"
                      type="number"
                      placeholder="VD: 5"
                      value={form.seats}
                      onChange={(e) => updateForm({ seats: e.target.value })}
                      error={errors.seats}
                    />
                  </div>
                )}

                {form.vehicleType === "car" && (
                  <div>
                    <Label htmlFor="seats">Số Kms</Label>
                    <Input
                      id="kms"
                      type="number"
                      placeholder="VD: 5000"
                      value={form.kms}
                      onChange={(e) => updateForm({ kms: e.target.value })}
                      error={errors.kms}
                    />
                  </div>
                )}

                {form.vehicleType === "motorbike" && (
                  <div>
                    <Label htmlFor="engineCC">Dung tích (cc)</Label>
                    <Input
                      id="engineCC"
                      type="number"
                      placeholder="VD: 125"
                      value={form.engineCC}
                      onChange={(e) => updateForm({ engineCC: e.target.value })}
                      error={errors.engineCC}
                    />
                  </div>
                )}

                {/* Address & optional pickup notes */}
                <div>
                  <Label htmlFor="address">Địa chỉ nhận/trả xe</Label>
                  <AddressSearchBox
                    value={form.address}
                    onChange={(v) => updateForm({ address: v })}
                    onPick={() => {
                      // chọn từ gợi ý thì clear lỗi (nếu có)
                      if (errors.address)
                        setErrors((e) => ({ ...e, address: "" }));
                    }}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </SectionCard>
            )}

            {step === 1 && (
              <SectionCard title="Ảnh & mô tả">
                {/* Images */}
                <div>
                  <Label>Ảnh phương tiện</Label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={async (e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).slice(
                        0,
                        10
                      );
                      if (!files.length) return;
                      const urls = await readFilesAsDataURLs(files);
                      updateForm({
                        images: [...form.images, ...urls].slice(0, 10),
                      });
                    }}
                    className={cls(
                      "grid place-items-center rounded-2xl border border-dashed p-6 text-center transition",
                      errors.images
                        ? "border-red-400"
                        : "border-emerald-300/70 hover:bg-emerald-50/50"
                    )}
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-neutral-700">
                        Kéo‑thả ảnh vào đây, hoặc chọn tệp
                      </p>
                      <div>
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={async (e) => {
                            const files = Array.from(
                              e.target.files ?? []
                            ).slice(0, 10);
                            if (!files.length) return;
                            const urls = await readFilesAsDataURLs(files);
                            updateForm({
                              images: [...form.images, ...urls].slice(0, 10),
                            });
                          }}
                        />
                        <label
                          htmlFor="file-input"
                          className="cursor-pointer rounded-lg border border-emerald-600 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
                        >
                          Chọn tệp (tối đa 10)
                        </label>
                      </div>
                      {errors.images && (
                        <p className="text-xs text-red-600">{errors.images}</p>
                      )}
                    </div>
                  </div>

                  {form.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {form.images.map((src, i) => (
                        <div
                          key={`photo-${i}`}
                          className="relative overflow-hidden rounded-xl border"
                        >
                          <img
                            src={src}
                            alt={`Ảnh ${i + 1}`}
                            className="aspect-video w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateForm({
                                images: form.images.filter((_, j) => j !== i),
                              })
                            }
                            className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-emerald-800 shadow hover:bg-white"
                            aria-label="Xoá ảnh"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về xe, tình trạng, lưu ý..."
                    value={form.description}
                    onChange={(e) =>
                      updateForm({ description: e.target.value })
                    }
                    error={errors.description}
                  />
                </div>

                {/* Features */}
                <div>
                  <Label>Tính năng nổi bật</Label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {FEATURES.map((ft) => {
                      const checked = form.features.includes(ft);
                      return (
                        <label
                          key={ft}
                          className={cls(
                            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                            checked
                              ? "border-emerald-600 bg-emerald-50"
                              : "border-neutral-300 hover:bg-neutral-50"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              updateForm({
                                features: e.target.checked
                                  ? [...form.features, ft]
                                  : form.features.filter((x) => x !== ft),
                              })
                            }
                          />
                          <span>{ft}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 2 && (
              <SectionCard title="Giá & lịch">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="itemValue">Giá trị xe</Label>
                    <CurrencyInput
                      id="itemValue"
                      value={form.itemValue} // raw digits
                      onChangeRaw={(raw) => updateForm({ itemValue: raw })} // save raw digits
                      placeholder="VD: 2,000,000"
                    />
                    {errors.itemValue && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.itemValue}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="deposit">Đặt cọc</Label>
                    <CurrencyInput
                      id="deposit"
                      value={form.deposit}
                      onChangeRaw={(raw) => updateForm({ deposit: raw })}
                      placeholder="VD: 500,000"
                      error={errors.deposit}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="pricePerDay">Giá/ngày</Label>
                    <CurrencyInput
                      id="pricePerDay"
                      value={form.pricePerDay}
                      onChangeRaw={(raw) => updateForm({ pricePerDay: raw })}
                      placeholder="VD: 200,000"
                      error={errors.pricePerDay}
                    />
                  </div>
                  <div>
                    <Label htmlFor="latePrice">Phí trả muộn</Label>
                    <CurrencyInput
                      id="latePrice"
                      value={form.latePrice}
                      onChangeRaw={(raw) => updateForm({ latePrice: raw })}
                      placeholder="VD: 50,000"
                    />
                  </div>
                </div>
                {/* 
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="availableFrom">Khả dụng từ ngày</Label>
                      <DatePicker
                        id="availableFrom"
                        selected={toDate(form.availableFrom)}
                        onChange={(date) =>
                          updateForm({
                            availableFrom: toISO(date as Date | null),
                          })
                        }
                        dateFormat="dd/MM/yyyy"
                        locale="vi"
                        placeholderText="Chọn ngày bắt đầu"
                        className={cls(
                          "w-full rounded-lg border bg-white px-3 py-2 text-sm",
                          errors.availableFrom
                            ? "border-red-400"
                            : "border-neutral-300 focus:border-emerald-500 focus:outline-none"
                        )}
                      />
                      {errors.availableFrom && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.availableFrom}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="availableTo">Đến ngày</Label>
                      <DatePicker
                        id="availableTo"
                        selected={toDate(form.availableTo)}
                        onChange={(date) =>
                          updateForm({ availableTo: toISO(date as Date | null) })
                        }
                        dateFormat="dd/MM/yyyy"
                        locale="vi"
                        placeholderText="Chọn ngày kết thúc"
                        className={cls(
                          "w-full rounded-lg border bg-white px-3 py-2 text-sm",
                          errors.availableTo
                            ? "border-red-400"
                            : "border-neutral-300 focus:border-emerald-500 focus:outline-none"
                        )}
                      />
                      {errors.availableTo && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.availableTo}
                        </p>
                      )}
                    </div>
                  </div> */}

                <div>
                  <Label htmlFor="cancelPolicy">Chính sách huỷ</Label>
                  <Select
                    id="cancelPolicy"
                    value={form.cancellationPolicy}
                    onChange={(e) =>
                      updateForm({
                        cancellationPolicy: e.target
                          .value as ListingForm["cancellationPolicy"],
                      })
                    }
                  >
                    <option value="flexible">
                      Linh hoạt (hoàn 100% trước 24h)
                    </option>
                    <option value="moderate">Vừa phải (50% trong 24h)</option>
                    <option value="strict">Chặt (không hoàn trong 24h)</option>
                  </Select>
                </div>
              </SectionCard>
            )}

            {step === 3 && (
              <SectionCard title="Giấy tờ / Chứng nhận">
                <div className="space-y-4">
                  <div>
                    <Label>Ảnh giấy tờ xe (đăng ký, BH, ...)</Label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files).slice(
                          0,
                          10
                        );
                        if (!files.length) return;
                        const urls = await readFilesAsDataURLs(files);
                        updateForm({
                          certificateImages: [
                            ...form.certificateImages,
                            ...urls,
                          ].slice(0, 10),
                        });
                      }}
                      className={cls(
                        "grid place-items-center rounded-2xl border border-dashed p-6 text-center transition",
                        errors.certificateImages
                          ? "border-red-400"
                          : "border-emerald-300/70 hover:bg-emerald-50/50"
                      )}
                    >
                      <div className="space-y-2">
                        <p className="text-sm text-neutral-700">
                          Kéo‑thả ảnh vào đây, hoặc chọn tệp
                        </p>
                        <div>
                          <input
                            id="cert-file-input"
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            onChange={async (e) => {
                              const files = Array.from(
                                e.target.files ?? []
                              ).slice(0, 10);
                              if (!files.length) return;
                              const urls = await readFilesAsDataURLs(files);
                              updateForm({
                                certificateImages: [
                                  ...form.certificateImages,
                                  ...urls,
                                ].slice(0, 10),
                              });
                            }}
                          />
                          <label
                            htmlFor="cert-file-input"
                            className="cursor-pointer rounded-lg border border-emerald-600 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
                          >
                            Chọn tệp (tối đa 10)
                          </label>
                        </div>
                        {errors.certificateImages && (
                          <p className="text-xs text-red-600">
                            {errors.certificateImages}
                          </p>
                        )}
                      </div>
                    </div>

                    {form.certificateImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {form.certificateImages.map((src, i) => (
                          <div
                            key={`cert-photo-${i}`}
                            className="relative overflow-hidden rounded-xl border"
                          >
                            <img
                              src={src}
                              alt={`Giấy tờ ${i + 1}`}
                              className="aspect-video w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateForm({
                                  certificateImages:
                                    form.certificateImages.filter(
                                      (_, j) => j !== i
                                    ),
                                })
                              }
                              className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-emerald-800 shadow hover:bg-white"
                              aria-label="Xoá ảnh"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            )}

            {step === 4 && (
              <SectionCard title="Xem lại & xác nhận">
                <div className="space-y-4">
                  <SummaryRow
                    label="Loại"
                    value={form.vehicleType === "car" ? "Ô tô" : "Xe máy"}
                  />
                  <SummaryRow label="Hãng" value={form.brand || "—"} />
                  <SummaryRow label="Mẫu" value={form.model || "—"} />
                  <SummaryRow label="Năm" value={form.year || "—"} />
                  <SummaryRow
                    label="Biển số"
                    value={form.licensePlate || "—"}
                  />
                  <SummaryRow label="Hộp số" value={form.transmission || "—"} />
                  <SummaryRow label="Nhiên liệu" value={form.fuel || "—"} />
                  {form.vehicleType === "car" ? (
                    <SummaryRow label="Số chỗ" value={form.seats || "—"} />
                  ) : (
                    <SummaryRow
                      label="Dung tích (cc)"
                      value={form.engineCC || "—"}
                    />
                  )}
                  <SummaryRow label="Địa chỉ" value={form.address || "—"} />
                  <div>
                    <Label>Mô tả</Label>
                    <div className="mt-1 rounded-lg border bg-white p-3 text-sm">
                      {form.description || "—"}
                    </div>
                  </div>
                  <div>
                    <Label>Ảnh ({form.images.length})</Label>
                    {form.images.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {form.images.map((src, i) => (
                          <img
                            key={`preview-${i}`}
                            src={src}
                            alt={`Ảnh ${i + 1}`}
                            className="aspect-video w-full rounded-lg border object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-600">
                        Chưa có ảnh
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Giấy tờ ({form.certificateImages.length})</Label>
                    {form.certificateImages.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {form.certificateImages.map((src, i) => (
                          <img
                            key={`cert-preview-${i}`}
                            src={src}
                            alt={`Giấy tờ ${i + 1}`}
                            className="aspect-video w-full rounded-lg border object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-neutral-600">
                        Chưa có ảnh giấy tờ
                      </p>
                    )}
                  </div>

                  <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-neutral-300 bg-white p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={form.acceptTerms}
                      onChange={(e) =>
                        updateForm({ acceptTerms: e.target.checked })
                      }
                    />
                    <span>
                      Tôi xác nhận thông tin là chính xác và đồng ý điều khoản
                      dịch vụ.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-xs text-red-600">{errors.acceptTerms}</p>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className={cls(
                  "rounded-lg border px-4 py-2 text-sm",
                  step === 0
                    ? "cursor-not-allowed border-neutral-200 text-neutral-400"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                )}
              >
                Quay lại
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-800"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitting}
                  className={cls(
                    "rounded-lg px-4 py-2 text-sm text-white",
                    submitting
                      ? "bg-emerald-400"
                      : "bg-emerald-700 hover:bg-emerald-800"
                  )}
                >
                  {submitting ? "Đang đăng..." : "Đăng listing"}
                </button>
              )}
            </div>
          </div>

          {/* Right: Sticky Preview */}
          <aside className="lg:sticky lg:top-20">
            <div className="rounded-2xl border border-emerald-900/10 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-emerald-900">
                Xem trước
              </h4>
              <div className="overflow-hidden rounded-xl border bg-neutral-100">
                {form.images[0] ? (
                  <img
                    src={form.images[0]}
                    alt="Ảnh chính"
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-video place-items-center text-sm text-neutral-500">
                    Chưa có ảnh
                  </div>
                )}
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="font-medium">
                  {form.brand || "Hãng"} {form.model || "Mẫu"}
                </div>
                <div className="text-neutral-600">
                  {form.address || "Địa chỉ hiển thị ở đây"}
                </div>
                <div className="text-neutral-700">
                  {form.vehicleType === "car"
                    ? `${form.seats || "—"} chỗ`
                    : `${form.engineCC || "—"} cc`}
                  {" • "}
                  {form.transmission || "—"} {" • "} {form.fuel || "—"}
                </div>
                <div className="text-emerald-700">
                  {form.pricePerDay
                    ? `${currencyFormat(Number(form.pricePerDay))} /ngày`
                    : "—"}
                </div>
              </div>

              {/* Quick tips */}
              <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-neutral-600">
                <li>Ảnh rõ, nhiều góc → tăng tỉ lệ đặt.</li>
                <li>Giá cạnh tranh và mô tả chi tiết.</li>
                <li>Chọn khung thời gian khả dụng phù hợp.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
