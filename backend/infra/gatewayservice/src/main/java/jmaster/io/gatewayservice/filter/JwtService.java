package jmaster.io.gatewayservice.filter;

import jmaster.io.gatewayservice.redis.TokenBlacklistService;
import jmaster.io.gatewayservice.redis.TokenVersionService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.List;

@Service
public class JwtService {

    private final String jwtSecret;
    private final TokenVersionService tokenVersionService;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtService(
            @Value("${bezkoder.app.jwtSecret}") String jwtSecret,
            TokenVersionService tokenVersionService,
            TokenBlacklistService tokenBlacklistService
    ) {
        this.jwtSecret = jwtSecret;
        this.tokenVersionService = tokenVersionService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    private Key getSignKey() {
        // Secret ở config server là Base64 string -> cần decode
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public List<String> extractRoles(String token) {
        Claims claims = extractClaims(token);
        return claims.get("roles", List.class);
    }

    public Long extractId(String token) {
        return extractClaims(token).get("id", Long.class);
    }

    public String extractDeviceId(String token) {
        return extractClaims(token).get("deviceId", String.class);
    }

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

            if (tokenBlacklistService.isBlackListed(claims.getId())) {
                throw new JwtException("Token invalid due to it is blacklisted");
            }

            int tokenInRedis = tokenVersionService.getTokenVersion(userId);
            if (tokenInRedis != tokenVersion) {
                throw new JwtException("Token invalid due to version mismatch: " + tokenVersion);
            }

            return claims;
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired", e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Token invalid", e);
        }
    }
}