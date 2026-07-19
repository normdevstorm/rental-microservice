package jmaster.io.gatewayservice.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {
    private final RedisTemplate<String, Object> redisTemplate;

    public TokenBlacklistService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Thêm accessToken vào blacklist
    public void blacklistAccessToken(String jti, long expirySeconds) {
        redisTemplate.opsForValue().set("blacklist:" + jti, "true", expirySeconds, TimeUnit.SECONDS);
    }

    // Kiểm tra token có bị blacklist không
    public boolean isBlackListed(String jti) {
        Boolean result = redisTemplate.hasKey("blackList:" + jti);
        return Boolean.TRUE.equals(result);
    }

}

