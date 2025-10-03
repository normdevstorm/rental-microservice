import { sendPost } from '../common/services/axios';

export const regisToken = (payload: any) =>
  sendPost('/fcm/regist-token', payload).then((res) => res?.data);
