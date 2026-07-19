import { RouterProvider } from "react-router-dom";
import router from "./common/router";
import { onMessageListener } from "./common/services/firebase";
import { useGlobalAlert } from "./common/components/AlertDialog/AlertProvider";

function App() {
  const alertDialog = useGlobalAlert();
  onMessageListener({ alertDialog: alertDialog });
  return <RouterProvider router={router} />;
}

export default App;
