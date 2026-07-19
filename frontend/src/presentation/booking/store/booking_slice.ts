import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateBookingRequest } from "../../../data/booking/model/request/create_booking_request";
import { bookingRepository } from "../../../data/booking/repository/booking_repostitory";
import { BookingResponse } from "../../../data/booking/model/response/booking_owner_response";
import {
  StateStatus,
  StateStatusType,
} from "../../../common/types/enums/enums";

export interface BookingState {
  bookingData: CreateBookingRequest | BookingResponse | null;
  status: StateStatusType;
  error: string | null;
}

const initialBookingState: BookingState = {
  bookingData: {
    itemId: 0,
    startTime: "",
    endTime: "",
  },
  status: StateStatus.INITIAL,
  error: null,
};

export { initialBookingState as initialState };

const createBooking = createAsyncThunk(
  "booking/create",
  async (createBookingRequest: CreateBookingRequest, thunkAPI) => {
    const response = await bookingRepository.createBooking(
      createBookingRequest
    );
    return response;
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: initialBookingState,
  reducers: {
    collectCreateBookingData: (
      state,
      action: PayloadAction<CreateBookingRequest>
    ) => {
      state.bookingData = action.payload;
      state.status = StateStatus.PROCESSING;
      state.error = null;
    },
    // setstatus: (state, action) => {
    //   state.status = action.payload;
    // },
    // setError: (state, action) => {
    //   state.error = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.status = StateStatus.LOADING;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = StateStatus.SUCCESS;
        state.bookingData = action.payload as BookingResponse;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = StateStatus.ERROR;
        state.error = action.error.message || "Failed to create booking";
      });
  },
});
///TODO: export synchronous actions, async thunks, and the reducer
export const { collectCreateBookingData } = bookingSlice.actions;
export { createBooking };
export default bookingSlice.reducer;
