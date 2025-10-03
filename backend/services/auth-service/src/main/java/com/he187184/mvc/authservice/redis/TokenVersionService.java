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
        String key = "token_version:" + userId;
        redisTemplate.opsForValue().set(key, String.valueOf(version));
    }

    public int getTokenVersion(Long userId) {
        String key = "token_version:" + userId;
        String versionStr = redisTemplate.opsForValue().get(key);
        return versionStr != null ? Integer.parseInt(versionStr) : 0;
    }

    public void deleteTokenVersion(Long userId) {
        String key = "token_version:" + userId;
        redisTemplate.delete(key);
    }
    public void updateTokenVersion(Long userId, int newVersion) {
        String key = "token_version:" + userId;
        redisTemplate.opsForValue().set(key, String.valueOf(newVersion));
    }

}