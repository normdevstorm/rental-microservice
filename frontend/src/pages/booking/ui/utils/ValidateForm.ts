import { Renter } from '../types/Renter';

export const validateForm = (data: Renter): string[] => {
  const errors: string[] = [];

  if (!data.fullName.trim()) {
    errors.push('Họ và tên là bắt buộc.');
  }

  if (!data.idCard.trim()) {
    errors.push('CMND/CCCD là bắt buộc.');
  }

  if (data.phone && !/^0\d{9,10}$/.test(data.phone)) {
    errors.push('Số điện thoại không hợp lệ.');
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email không hợp lệ.');
  }

  return errors;
};
