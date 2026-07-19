import React from "react";
import Input from "./Input";

// --- UI number formatting (commas) while keeping raw digits in form state ---
export const formatThousands = (rawDigits: string) => {
  const x = (rawDigits || "").replace(/[^\d]/g, "");
  if (!x) return "";
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const stripToDigits = (s: string) => (s || "").replace(/[^\d]/g, "");

type CurrencyInputProps = {
  id?: string;
  value: string; // raw digits only (e.g., "1000000")
  onChangeRaw: (raw: string) => void; // write back raw digits to parent
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
};

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    { id, value, onChangeRaw, placeholder, error, className, disabled },
    ref
  ) => {
    const [display, setDisplay] = React.useState(formatThousands(value));
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // merge refs
    React.useEffect(() => {
      if (!ref) return;
      if (typeof ref === "function") ref(inputRef.current!);
      else
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          inputRef.current;
    }, [ref]);

    // keep display in sync if parent updates raw value
    React.useEffect(() => {
      setDisplay(formatThousands(value));
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const nextDisplay = e.target.value;
      const raw = stripToDigits(nextDisplay);
      onChangeRaw(raw); // save digits to form state
      const formatted = formatThousands(raw);
      setDisplay(formatted);

      // keep caret at the end (simplest stable behavior for currency fields)
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        const pos = el.value.length;
        try {
          el.setSelectionRange(pos, pos);
        } catch {}
      });
    };

    return (
      <Input
        ref={inputRef}
        id={id}
        type="text" // MUST be text; number input won't accept commas
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        error={error}
        disabled={disabled}
        className={className}
      />
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";
export default CurrencyInput;
