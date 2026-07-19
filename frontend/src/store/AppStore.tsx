import { persistor, store } from ".";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface AppStoreProps {
  children: React.ReactNode;
}

const AppStore: React.FC<AppStoreProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default AppStore;
