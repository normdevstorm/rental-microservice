package org.example.commonlib.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;

@Service
public class JwtService {


    private String jwtSecret = "bezkoder.app.jwtSecret=eZgDADp8dsMJsMerDXgnuzGdwdq9A9XGz9SLMry+pqM=";

    private Key getSignKey() {
        // Secret ở config server là Base64 string -> cần decode
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Lấy username từ token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Lấy role từ token
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // Kiểm tra token hợp lệ
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
