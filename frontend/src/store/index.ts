import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { useSelector } from "react-redux";
import rootReducer from "./rootReducer";
import storage from "redux-persist/lib/storage";
import localStorageService from "../common/services/localStorageService";
// import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage: storage,
  // Optional: specify which reducers to persist
  whitelist: ["auth", "booking"], // only these will be persisted
  // blacklist: ['temporary'], // these won't be persisted
}; // sessionStorage: true, // Use sessionStorage instead of localStorage

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const clearPersistedState = () => {
  // Clear persisted state from storage
  storage.removeItem("persist:root");
  // Optionally, you might want to reset your Redux store to its initial state here
  // store.dispatch({ type: 'RESET_APP' }); // Dispatch a custom action to reset your store
};

export const persistor = persistStore(store);
export type RootDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<RootDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
