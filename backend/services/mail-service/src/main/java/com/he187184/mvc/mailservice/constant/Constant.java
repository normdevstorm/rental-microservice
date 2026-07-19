package com.he187184.mvc.mailservice.constant;

public class Constant {
    public static final int expirationTime =  3 * 60 * 1000;
    public static final String EMAIL_VERIFICATION_SUBJECT = "Email verification code";
    public static final String EMAIL_FROM = "Rental Website <%s>";
    public static final String HTML_TEMPLATE =  """
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="background-color: #f6fff6; font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 480px; margin: 40px auto; background: #e6ffe6; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 32px;">
    <h2 style="color: #2e7d32; text-align: center; margin-bottom: 24px;">Verify Your Email Address</h2>
    <p style="font-size: 16px; color: #333; text-align: center;">
      Please use the following verification code to complete your sign-up:
    </p>
    <div style="background: #c8f7c5; color: #1b5e20; font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; border-radius: 8px; margin: 24px 0; padding: 16px 0;">
      <span>%s</span>
    </div>
    <p style="font-size: 15px; color: #333; text-align: center;">
      <strong>Expiration time:</strong> <span style="color: #388e3c;">%s</span>
    </p>
    <p style="font-size: 13px; color: #666; text-align: center; margin-top: 32px;">
      If you did not request this code, please ignore this email.
    </p>
  </div>
</body>
</html>
""";
}
