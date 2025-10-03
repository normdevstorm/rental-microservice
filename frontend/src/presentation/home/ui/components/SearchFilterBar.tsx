import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, DatePicker, Modal, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  CalendarIcon,
  LocationIcon,
} from "../../../../common/components/Icons";
import { addressRepository } from "../../../../data/address/repository/address_repository";
import { use } from "i18next";
import { AddressResponse } from "../../../../data/address/model/response/address_response";

export interface FilterValues {
  location?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
}

interface Props {
  values: FilterValues;
  onChange: (v: FilterValues) => void;
  onFind?: () => void;
}

const SearchFilterBar: React.FC<Props> = ({ values, onChange, onFind }) => {
  // dialogs
  const [openLocation, setOpenLocation] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  // local state
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [fetchingAddr, setFetchingAddr] = useState(false);
  const defaultLoc = values.location ?? "TP. Hồ Chí Minh";
  const today = dayjs().startOf("day");
  const defaultRange: [Dayjs, Dayjs] = [today, today.add(1, "day")];
  const [loc, setLoc] = useState<string | undefined>(
    values.location ?? defaultLoc
  );
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    values.startDate && values.endDate
      ? [dayjs(values.startDate), dayjs(values.endDate)]
      : defaultRange
  );
  const didInit = useRef(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRequestId = useRef(0);

  // on first mount, push defaults up when not provided
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (!values.location || !values.startDate || !values.endDate) {
      onChange({
        location: values.location ?? defaultLoc,
        startDate: (range?.[0] as Dayjs).toISOString(),
        endDate: (range?.[1] as Dayjs).toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // central fetcher to keep only the latest response
  const fetchAddr = async (query?: string) => {
    const reqId = ++lastRequestId.current;
    setFetchingAddr(true);
    try {
      const q = (query ?? "").trim();
      const res = await addressRepository.getAllAddresses(q || defaultLoc);
      // const list = (res ?? []).map((a: any) =>
      //   typeof a === "string" ? a : a?.name
      // );
      if (reqId === lastRequestId.current) setAddresses(res ?? []);
    } catch (e) {
      if (reqId === lastRequestId.current) setAddresses([]);
    } finally {
      if (reqId === lastRequestId.current) setFetchingAddr(false);
    }
  };

  // debounced search handler
  const remoteSearch = (q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      // avoid spamming empty queries; fall back to default when blank
      fetchAddr(q);
    }, 300);
  };

  // cleanup pending timers on unmount
  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const labelDate = useMemo(() => {
    const sVal =
      values.startDate || (range?.[0] as Dayjs | null)?.toISOString();
    const eVal = values.endDate || (range?.[1] as Dayjs | null)?.toISOString();
    if (!sVal || !eVal) return "Thời gian";
    const s = dayjs(sVal).format("DD/MM/YYYY");
    const e = dayjs(eVal).format("DD/MM/YYYY");
    return `${s} - ${e}`;
  }, [values.startDate, values.endDate, range]);

  const handleOpenLocation = async () => {
    setOpenLocation(true);
    if (addresses.length === 0) {
      // prime with current/default location immediately (no debounce)
      fetchAddr(values.location ?? defaultLoc);
    }
  };

  const applyLocation = () => {
    onChange({ ...values, location: loc });
    setOpenLocation(false);
  };

  const applyDates = () => {
    const start = range?.[0]?.startOf("day");
    const end = range?.[1]?.endOf("day");
    onChange({
      ...values,
      startDate: start ? start.toISOString() : undefined,
      endDate: end ? end.toISOString() : undefined,
    });
    setOpenDates(false);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-2xl p-3 md:p-3.5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_minmax(84px,auto)] gap-2.5 md:gap-3 items-stretch">
        <Button
          onClick={handleOpenLocation}
          className="justify-start h-12 md:h-14 rounded-md text-left px-3.5 md:px-4 bg-white border border-gray-200 hover:border-emerald-300 shadow-sm"
          size="large"
        >
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 text-gray-500 text-xs md:text-sm">
              <LocationIcon size={18} color="#10b981" />
              <span className="font-semibold uppercase tracking-wide">
                Địa điểm
              </span>
            </div>
            <div className="text-gray-900 font-semibold truncate text-sm md:text-base">
              {values.location || defaultLoc}
            </div>
          </div>
        </Button>

        <Button
          onClick={() => setOpenDates(true)}
          className="justify-start h-12 md:h-14 rounded-md text-left px-3.5 md:px-4 bg-white border border-gray-200 hover:border-emerald-300 shadow-sm"
          size="large"
        >
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center gap-2 text-gray-500 text-xs md:text-sm">
              <CalendarIcon size={18} color="#10b981" />
              <span className="font-semibold uppercase tracking-wide">
                Thời gian thuê
              </span>
            </div>
            <div className="text-gray-900 font-semibold truncate text-sm md:text-base">
              {labelDate}
            </div>
          </div>
        </Button>

        <Button
          type="primary"
          onClick={onFind}
          className="md:min-w-[84px] h-11 md:h-14 rounded-md bg-emerald-500 hover:bg-emerald-600 px-4 shadow-md text-sm"
          size="middle"
        >
          Tìm xe
        </Button>
      </div>

      <Modal
        open={openLocation}
        onCancel={() => setOpenLocation(false)}
        onOk={applyLocation}
        title="Chọn địa điểm"
        okText="Áp dụng"
        destroyOnClose
      >
        <Select
          showSearch
          value={loc}
          onChange={setLoc}
          onSearch={remoteSearch}
          placeholder="Chọn địa điểm"
          className="w-full"
          loading={fetchingAddr}
          filterOption={false}
          options={addresses.map((a) => ({
            key: a.place_id,
            value: a.name,
            label: a.name,
          }))}
        />
      </Modal>

      <Modal
        open={openDates}
        onCancel={() => setOpenDates(false)}
        onOk={applyDates}
        title="Chọn thời gian thuê"
        okText="Áp dụng"
        destroyOnClose
      >
        <DatePicker.RangePicker
          value={range as any}
          onChange={(v) => setRange(v)}
          format="DD/MM/YYYY"
          allowClear
        />
      </Modal>
    </div>
  );
};

export default SearchFilterBar;
