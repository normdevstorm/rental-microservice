import { emailVerificationApi } from "../api/emailVerificationApi";
import type { VerifyEmailRequest } from "../model/request/verify_email_request";
import { VerifyEmailResponse } from "../model/response/verify_email_response";

export interface IEmailVerificationRepository {
  verify(payload: VerifyEmailRequest): Promise<VerifyEmailResponse>;
  send(email: string): Promise<void>;
}

class EmailVerificationRepository implements IEmailVerificationRepository {
  private static instance: EmailVerificationRepository;

  public static getInstance(): EmailVerificationRepository {
    if (!EmailVerificationRepository.instance) {
      EmailVerificationRepository.instance = new EmailVerificationRepository();
    }
    return EmailVerificationRepository.instance;
  }
  async verify(payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const res = await emailVerificationApi.verify(payload);
    return res.data;
  }
  
async send(email: string): Promise<void> {
    await emailVerificationApi.send(email);
  }
}
export const emailVerificationRepository = EmailVerificationRepository.getInstance();
