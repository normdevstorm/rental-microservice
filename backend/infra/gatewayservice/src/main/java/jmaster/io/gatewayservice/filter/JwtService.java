package jmaster.io.gatewayservice.filter;

import jmaster.io.gatewayservice.client.UserClient;
import jmaster.io.gatewayservice.dto.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jmaster.io.gatewayservice.redis.TokenBlacklistService;
import jmaster.io.gatewayservice.redis.TokenVersionService;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.List;

@Service
public class JwtService {

    @Value("${bezkoder.app.jwtSecret}")
    private String jwtSecret;
    @Autowired
    private UserClient userClient;

    @Autowired
    TokenVersionService tokenVersionService;
    @Autowired
    TokenBlacklistService tokenBlacklistService;

    private Key getSignKey() {
        // Secret ở config server là Base64 string -> cần decode
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    // Lấy username từ token
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // Lấy role từ token
    public List<String> extractRoles(String token) {
        Claims claims = extractClaims(token);
        return claims.get("roles", List.class);
    }

    public Long extractId(String token) {
        return extractClaims(token).get("id", Long.class);
    }
    public String extractDeviceId(String token) { return extractClaims(token).get("deviceId", String.class); }


    // Kiểm tra token hợp lệ
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Claims extractClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Long userId = claims.get("id", Long.class);
            Integer tokenVersion = claims.get("tokenVersion", Integer.class);

            // check token in blacklist
            if(tokenBlacklistService.isBlacklisted(claims.getId())){
                throw new JwtException("Token invalid due to it is blacklisted");
            }

            // check version token so vs version token dc luu trong db ( dc cache o redis)
            int tokenInRedis = tokenVersionService.getTokenVersion(userId);
             if(tokenVersionService.getTokenVersion(userId) != tokenVersion){
                 throw new JwtException("Token invalid due to it is version " + tokenVersion);
             }

            return claims; // Token hợp lệ
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired", e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Token invalid", e);
        }
    }

}
