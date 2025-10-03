/* ... */
// --- Address Autocomplete (inline, minimal) ---

import React from "react";
import { AddressResponse } from "../../../../data/address/model/response/address_response";

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const AddressSearchBox: React.FC<{
  value: string;
  onChange: (v: string) => void; // cập nhật form.address mỗi khi gõ/chọn
  onPick?: (s: AddressResponse) => void;
  placeholder?: string;
  className?: string;
  minChars?: number;
}> = ({
  value,
  onChange,
  onPick,
  placeholder = "VD: 123 Đường ABC, Quận/Huyện...",
  className = "",
  minChars = 2,
}) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<AddressResponse[]>([]);
  const [active, setActive] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const listId = React.useMemo(
    () => `addr-list-${Math.random().toString(36).slice(2)}`,
    []
  );

  const q = useDebounced(value, 350);

  // fetch suggestions (debounced)
  React.useEffect(() => {
    const term = q.trim();
    if (term.length < minChars) {
      setItems([]);
      setOpen(false);
      setLoading(false);
      setErr(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setErr(null);

    fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        term
      )}&addressdetails=1&limit=8&countrycodes=vn`,
      {
        signal: controller.signal,
        headers: {
          // giúp trả về tiếng Việt nếu có
          "Accept-Language": "vi,en;q=0.8",
        },
      }
    )
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        const mapped: AddressResponse[] = (data || []).map((d: any) => ({
          id: d.place_id,
          lat: Number(d.lat),
          lon: Number(d.lon),
          place_id: d.place_id,
          addresstype: d.addresstype as string,
          name: d.name as string,
        }));
        setItems(mapped);
        setOpen(true);
        setActive(-1);
      })
      .catch((e) => {
        if ((e as any)?.name !== "AbortError") {
          setErr("Không thể tìm kiếm địa chỉ. Vui lòng thử lại.");
          setItems([]);
          setOpen(true);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, minChars]);

  const pick = (s: AddressResponse) => {
    onChange(s.name);
    onPick?.(s);
    setOpen(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (active >= 0 && active < items.length) {
        e.preventDefault();
        pick(items[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
    // BẮT root TRƯỚC khi defer để tránh currentTarget bị null
    const root = e.currentTarget as HTMLElement;

    requestAnimationFrame(() => {
      // dùng activeElement sau khi blur
      const related = (
        typeof document !== "undefined" ? document.activeElement : null
      ) as Element | null;
      if (!root || !related || !root.contains(related)) {
        setOpen(false);
      }
    });
  };

  return (
    <div
      className={`relative ${className}`}
      role="combobox"
      aria-expanded={open}
      aria-owns={listId}
      aria-haspopup="listbox"
      onBlur={onBlur}
    >
      <div className="mt-1 flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
        <svg
          className="h-4 w-4 text-neutral-500"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            stroke="currentColor"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
          />
        </svg>
        <input
          ref={inputRef}
          id="address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (value.trim().length >= minChars) setOpen(true);
          }}
          placeholder={placeholder}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={
            active >= 0 && items[active]
              ? String(items[active].place_id)
              : undefined
          }
          className="w-full outline-none placeholder-neutral-400"
        />
        {value && (
          <button
            type="button"
            aria-label="Xoá nội dung"
            className="text-neutral-400 hover:text-neutral-600"
            onClick={() => {
              onChange("");
              setItems([]);
              setOpen(false);
              setActive(-1);
              inputRef.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
          {loading && (
            <div className="p-3 text-sm text-neutral-500">Đang tìm…</div>
          )}
          {!loading && err && (
            <div className="p-3 text-sm text-red-600">{err}</div>
          )}
          {!loading &&
            !err &&
            items.length === 0 &&
            value.trim().length >= minChars && (
              <div className="p-3 text-sm text-neutral-500">
                Không có kết quả
              </div>
            )}
          {!loading && !err && items.length > 0 && (
            <ul
              id={listId}
              role="listbox"
              ref={listRef}
              className="max-h-60 overflow-auto"
            >
              {items.map((s, idx) => {
                const isActive = idx === active;
                return (
                  <li
                    key={s.place_id}
                    id={String(s.place_id)}
                    role="option"
                    aria-selected={isActive}
                    className={`cursor-pointer px-3 py-2 text-sm ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "hover:bg-neutral-50"
                    }`}
                    onMouseEnter={() => setActive(idx)}
                    onMouseDown={(e) => e.preventDefault()} // giữ focus input
                    onClick={() => pick(s)}
                    title={s.name}
                  >
                    {s.name}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressSearchBox;
