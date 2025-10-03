package jmaster.io.gatewayservice.filter;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
// filter nay da validate token roi, vaf exact username, va sau do truyen cho cac request khac
// cac request khac se load tu database tu username va sau do set vao securitycontext, cac service khac cung phan quyen them
@Component
public class JwtAuthenticationFilterGateway implements GatewayFilter, Ordered {

    private final JwtService jwtService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final List<String> publicPaths;

    public JwtAuthenticationFilterGateway(JwtService jwtService,
                                          @Value("${app.public-paths}") String publicPathsProp) {
        this.jwtService = jwtService;
        this.publicPaths = Arrays.asList(publicPathsProp.split(","));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String requestPath = exchange.getRequest().getURI().getPath();
        System.out.println("Public paths: " + publicPaths);

        // Public API → bỏ qua
        if (isPublic(requestPath)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Token hợp lệ → forward request kèm theo thông tin user xuống service nghiệp vụ
        String username = jwtService.extractUsername(token);
        List<String> role = jwtService.extractRoles(token);
        Long id = jwtService.extractId(token);
        String deviceId = jwtService.extractDeviceId(token);
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(r -> r.headers(headers -> {
                    headers.add("X-User-Name", username);
                    headers.add("X-User-Roles", String.join(",", role));
                    headers.add("X-User-Id", String.valueOf(id));
                    headers.add("X-Device-Id", deviceId);
                }))
                .build();

        return chain.filter(mutatedExchange);
    }

    private boolean isPublic(String path) {
        return publicPaths.stream().anyMatch(p -> pathMatcher.match(p.trim(), path));
    }

    @Override
    public int getOrder() {
        return -1; // chạy sớm
    }
}
