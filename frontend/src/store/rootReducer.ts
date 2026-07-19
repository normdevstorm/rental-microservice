import { combineReducers } from "@reduxjs/toolkit";
import sidebarReducer from "./reducers/sidebarSlice";
import authReducer from "../presentation/auth/stores/authSlice";
import bookingReducer from "../presentation/booking/store/booking_slice";
import errorReducer from "./reducers/errorSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
  error: errorReducer,
  booking: bookingReducer,
});

export default rootReducer;
