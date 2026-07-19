import React from "react";
import { Transition } from "@headlessui/react";
import { MdErrorOutline, MdInfo, MdClose } from "react-icons/md";

export type AlertThemeType = "error" | "noti";

export interface AlertDialogBaseProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type?: AlertThemeType;
  autoCloseMs?: number;
}

const colorByType = (type: AlertThemeType | undefined) => {
  if (type === "error") {
    return {
      ring: "ring-red-200",
      bg: "bg-white",
      border: "border-red-200",
      accent: "text-red-600",
      iconBg: "bg-red-50",
      button: "hover:bg-red-50",
      progress: "bg-red-500",
      shadow: "shadow-red-100",
    } as const;
  }
  // default: green (notification)
  return {
    ring: "ring-emerald-200",
    bg: "bg-white",
    border: "border-emerald-200",
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50",
    button: "hover:bg-emerald-50",
    progress: "bg-emerald-500",
    shadow: "shadow-emerald-100",
  } as const;
};

export const AlertDialogBase: React.FC<AlertDialogBaseProps> = ({
  open,
  onClose,
  message,
  type = "noti",
  autoCloseMs = 3000,
}) => {
  const [visible, setVisible] = React.useState(open);
  const [progress, setProgress] = React.useState(100);
  const colors = colorByType(type);

  React.useEffect(() => {
    setVisible(open);
  }, [open]);

  React.useEffect(() => {
    if (!visible) return;

    setProgress(100);
    let raf: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.max(0, 100 - (elapsed / autoCloseMs) * 100);
      setProgress(pct);
      if (elapsed < autoCloseMs) {
        raf = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        onClose?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, autoCloseMs, onClose]);

  const Icon = type === "error" ? MdErrorOutline : MdInfo;

  return (
    <Transition
      show={visible}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-2 scale-95"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 translate-y-2 scale-95"
    >
      <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md">
          <div
            className={`pointer-events-auto overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} ring-1 ${colors.ring} shadow-lg ${colors.shadow}`}
            role="alert"
            aria-live="assertive"
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`h-9 w-9 ${colors.iconBg} rounded-xl flex items-center justify-center`}
                >
                  {React.createElement(Icon as any, {
                    className: `${colors.accent}`,
                    size: 20,
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 leading-5">{message}</p>
                </div>
                <button
                  onClick={() => {
                    setVisible(false);
                    onClose?.();
                  }}
                  className={`shrink-0 rounded-lg p-1 text-gray-500 transition ${colors.button}`}
                  aria-label="Close alert"
                >
                  {React.createElement(MdClose as any, { size: 18 })}
                </button>
              </div>
            </div>
            <div className="relative h-1 w-full bg-gray-100">
              <div
                className={`absolute left-0 top-0 h-full ${colors.progress}`}
                style={{
                  width: `${progress}%`,
                  transition: "width 80ms linear",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

// Simple, requirement-focused API: props = message + type
export interface AlertDialogProps {
  message: string;
  type?: AlertThemeType; // error -> red, else green
  durationMs?: number; // optional, default 3000
  onClose?: () => void; // optional callback after auto close
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  message,
  type = "noti",
  durationMs = 3000,
  onClose,
}) => {
  const [open, setOpen] = React.useState(true);

  return (
    <AlertDialogBase
      open={open}
      onClose={() => {
        setOpen(false);
        onClose?.();
      }}
      message={message}
      type={type}
      autoCloseMs={durationMs}
    />
  );
};

export default AlertDialog;
