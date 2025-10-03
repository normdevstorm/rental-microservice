import { RouterProvider } from "react-router-dom";
import router from "./common/router";
import { messaging, onMessageListener } from "./common/services/firebase";
import {
  GlobalAlertApi,
  useGlobalAlert,
} from "./common/components/AlertDialog/AlertProvider";
import { onMessage } from "firebase/messaging";

function App() {
  const alertDialog = useGlobalAlert();
  onMessageListener({ alertDialog: alertDialog });
  return <RouterProvider router={router} />;
}

export default App;
