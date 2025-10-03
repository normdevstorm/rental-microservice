package com.he187184.mvc.authservice.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class RefreshTokenService {
    private final RedisTemplate<String, Object> redisTemplate;

    public RefreshTokenService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }



    // Lưu refresh token
    public void saveRefreshToken(String refreshToken, Long userId, String deviceId, long expiryDays) {
        Map<String, String> data = new HashMap<>();
        data.put("userId", userId.toString());
        data.put("deviceId", deviceId);

        redisTemplate.opsForHash().putAll("refresh:" + refreshToken, data);
        redisTemplate.expire("refresh:" + refreshToken, expiryDays, TimeUnit.DAYS);
        redisTemplate.opsForSet().add("user:refreshTokens:"+userId , refreshToken);
    }

    // Lấy refresh token
    public Map<Object, Object> getRefreshToken(String refreshToken) {
        return redisTemplate.opsForHash().entries("refresh:" + refreshToken);
    }
    public void removeAllRefreshToken( Long userId) {
        String key = "user:refreshTokens:" + userId;
        Set<Object> tokens = redisTemplate.opsForSet().members(key);
        if (tokens != null) {
            for (Object token : tokens) {
                deleteRefreshToken(token.toString(), userId);
            }
            redisTemplate.delete(key);
        }

    }
    // Xóa refresh token (logout)
    public void deleteRefreshToken(String refreshToken, Long userId) {
        // Xóa hash
        redisTemplate.delete("refresh:" + refreshToken);

        // Xóa khỏi Set của user
        redisTemplate.opsForSet().remove("user:refreshTokens:" + userId, refreshToken);
    }

}

