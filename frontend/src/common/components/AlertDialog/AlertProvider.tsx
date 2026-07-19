import React, { createContext, useContext } from "react";
import { useAlert } from "./useAlert";

export type GlobalAlertApi = {
  notify: (message: string) => void;
  error: (message: string) => void;
};

const AlertContext = createContext<GlobalAlertApi | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify, error, AlertHost } = useAlert();

  return (
    <AlertContext.Provider value={{ notify, error }}>
      {children}
      {/* Render host once at root */}
      <AlertHost />
    </AlertContext.Provider>
  );
};

export const useGlobalAlert = (): GlobalAlertApi => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useGlobalAlert must be used within AlertProvider");
  return ctx;
};

export default AlertProvider;
