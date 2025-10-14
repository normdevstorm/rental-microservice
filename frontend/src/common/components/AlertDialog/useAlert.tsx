import React from "react";
import { createPortal } from "react-dom";
import { AlertDialogBase, AlertThemeType } from "./index";

export type UseAlert = {
  notify: (message: string) => void;
  error: (message: string) => void;
  AlertHost: React.FC;
};

export const useAlert = (): UseAlert => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [type, setType] = React.useState<AlertThemeType>("noti");

  const show = (msg: string, t: AlertThemeType) => {
    setMessage(msg);
    setType(t);
    setOpen(true);
  };

  const notify = (msg: string) => show(msg, "noti");
  const error = (msg: string) => show(msg, "error");

  const AlertHost: React.FC = () => {
    return createPortal(
      <AlertDialogBase
        open={open}
        onClose={() => setOpen(false)}
        message={message}
        type={type}
      />,
      document.body
    );
  };

  return { notify, error, AlertHost };
};

export default useAlert;
