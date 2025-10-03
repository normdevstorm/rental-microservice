import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AppStore from "./store/AppStore";
import { AlertProvider } from "./common/components/AlertDialog/AlertProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { initializeFirebaseMessaging } from "./common/services/firebase";

// Initialize Firebase messaging when app starts
initializeFirebaseMessaging();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*control refetch when focus on window*/
      refetchOnWindowFocus: true,
      // /*Queries that fail are silently retried 3 times, with exponential backoff delay before capturing and displaying an error to the UI if retry = true*/
      retry: false,
      // /*default staleTime means queries will not refetch their data as often*/
      staleTime: 1 * 10 * 1000,
      refetchInterval: 1 * 5 * 1000,
      // cacheTime:
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppStore>
        <QueryClientProvider client={queryClient}>
          <AlertProvider>
            <App />
          </AlertProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </AppStore>
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
