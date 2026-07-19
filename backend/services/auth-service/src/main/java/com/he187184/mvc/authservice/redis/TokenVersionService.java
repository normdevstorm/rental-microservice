package com.he187184.mvc.authservice.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class TokenVersionService {

    private final RedisTemplate<String, String> redisTemplate;

    @Autowired
    public TokenVersionService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveTokenVersion(Long userId, int version) {
        redisTemplate.opsForValue().set(getKey(userId), String.valueOf(version));
    }

    public int getTokenVersion(Long userId) {
        String versionStr = redisTemplate.opsForValue().get(getKey(userId));
        return versionStr != null ? Integer.parseInt(versionStr) : 0;
    }

    public void deleteTokenVersion(Long userId) {
        redisTemplate.delete(getKey(userId));
    }
    public void updateTokenVersion(Long userId, int newVersion) {
        redisTemplate.opsForValue().set(getKey(userId), String.valueOf(newVersion));
    }

    private static String getKey(Long userId) {
        return "token_version:" + userId;
    }

}