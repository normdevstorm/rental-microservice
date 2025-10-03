package com.he187184.mvc.authservice.security.jwt;

import com.he187184.mvc.authservice.dto.response.JwtResponse;
import com.he187184.mvc.authservice.security.service.UserDetailsImpl;
import com.he187184.mvc.authservice.security.service.UserDetailsServiceImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Data;
import org.example.commonlib.dto.ResponseCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${bezkoder.app.jwtSecret}")
    private String jwtSecret;

    @Value("${bezkoder.app.jwtExpirationMs}")
    private int jwtExpirationMs;
    @Value("${bezkoder.app.refreshExpirationMs}")
    private int  refreshExpirationMs ; // 7 ngày
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    public String generateJwtToken(Authentication authentication, String deviceID) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        String jti = UUID.randomUUID().toString();
        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .setId(jti)// vẫn giữ email

                .claim("id", userPrincipal.getId())
                .claim("deviceId", deviceID)
                .claim("tokenVersion",userPrincipal.getTokenVersion())// thêm userId
                .claim("roles", userPrincipal.getAuthorities()
                        .stream()
                        .map(item -> item.getAuthority())
                        .toList())  // thêm roles
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshJwtToken() {
      return UUID.randomUUID().toString();

    }
     public JwtResponse generateTokenByEmail(String email, String deviceID) {

        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(email);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        String jwt = generateJwtToken(authentication, deviceID);
         Set<String> roles = userDetails.getAuthorities().stream()
                 .map(item -> item.getAuthority())
                 .collect(Collectors.toSet());
        return new JwtResponse(jwt,null,
                 userDetails.getId(),
                 userDetails.getUsername(),
                 userDetails.getEmail(),
                 roles);

     }
//    private Key getSignKey() {
//        // Secret ở config server là Base64 string -> cần decode
//        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
//    }

    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }
    public String getJtiFromJwtToken(String token) {
        return  extractClaims(token).getId();
    }
    public Long getIdFromJwtToken(String token) {
        return extractClaims(token).get("id", Long.class);
    }

    public long getJwtExpirationMs(String token) {
        Date expiration = extractClaims(token).getExpiration();
        return  (expiration.getTime() - System.currentTimeMillis());
    }

    public Claims extractClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();


            return claims; // Token hợp lệ
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token expired", e);
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtException("Token invalid", e);
        }
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }


}
