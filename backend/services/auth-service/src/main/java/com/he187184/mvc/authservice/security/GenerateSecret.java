package com.he187184.mvc.authservice.security;

import io.jsonwebtoken.security.Keys;
import java.util.Base64;
import javax.crypto.SecretKey;

public class GenerateSecret {
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        System.out.println(Base64.getEncoder().encodeToString(key.getEncoded()));
    }
}
