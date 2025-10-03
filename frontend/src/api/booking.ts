import { sendGet, sendPost } from "../common/services/axios";

export const getBookings = (params: any) =>
sendGet(`/bookings/booking`, params).then((res) => {
  return res;
});

export const getDetailBooking = (bookingId: any) =>
sendGet(`/bookings/booking/${bookingId}`).then((res) => {
  return res;
});

export const createBooking = (payload: {
  itemId: string;
  startDate: string;
  endDate: string;
}) => {
  return sendPost('/bookings', payload).then((res) => res?.data);
};
