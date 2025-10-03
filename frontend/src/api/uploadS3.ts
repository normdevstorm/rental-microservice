import { sendPostDRM, sendPostS3 } from '../common/services/axios';

export const uploadS3 = (url: string, payload: any) =>
  sendPostS3(url, payload).then((res) => res?.data);

export const uploadDRM = (url: string, payload: any) =>
  sendPostDRM(url, payload).then((res) => res?.data);
