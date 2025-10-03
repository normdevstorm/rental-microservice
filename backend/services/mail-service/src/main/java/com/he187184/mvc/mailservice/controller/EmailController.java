package com.he187184.mvc.mailservice.controller;

import com.he187184.mvc.mailservice.service.EmailService;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-verification-code")
    public ResponseEntity<BaseResponse<String>> getVerficationCode(@RequestParam String email){
        emailService.sendVerificationCode(email);
        return ResponseEntity.ok(new BaseResponse("Send verfication to" + " email " + "successfully", true, "200", "Verfication succeeded")
        );
    }

    @PostMapping("/verify-code")
    public ResponseEntity<BaseResponse<String>> verifyCode(@RequestParam String email, @RequestParam String code){
        // Gọi service để xác thực mã
        boolean isValid = emailService.verifyCode(email, code);
        if (isValid) {
            return ResponseEntity.ok(new BaseResponse("Verification succeeded", true, "200", null));
        } else {
            return ResponseEntity.status(400).body(new BaseResponse("Invalid verification code", false, "400", null));
        }
    }
}
