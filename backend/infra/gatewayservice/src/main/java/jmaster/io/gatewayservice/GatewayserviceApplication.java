package jmaster.io.gatewayservice;

import jmaster.io.gatewayservice.filter.JwtAuthenticationFilterGateway;

import io.netty.handler.codec.http.HttpMethod;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.util.pattern.PathPatternParser;

import java.util.Arrays;

@SpringBootApplication(scanBasePackages = {
        "jmaster.io.gatewayservice"
})
@EnableFeignClients(basePackages = "jmaster.io.gatewayservice.client")
@EnableDiscoveryClient
public class GatewayserviceApplication {


    public static void main(String[] args) {
        SpringApplication.run(GatewayserviceApplication.class, args);
    }



    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(false);
        config.setAllowedOrigins(Arrays.asList(
                "*"
        ));
        config.setAllowedMethods(Arrays.asList(
                HttpMethod.GET.name(),
                HttpMethod.POST.name(),
                HttpMethod.PUT.name(),
                HttpMethod.PATCH.name(),
                HttpMethod.DELETE.name(),
                HttpMethod.OPTIONS.name()
        ));

        // Allow headers your clients actually send
        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Origin",
                "Accept"
        ));

        // Expose headers you want browsers to be able to read
        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Location",
                "Link"
        ));

        // Cache preflight response (seconds)
        config.setMaxAge(3600L);

        // IMPORTANT: Use the reactive UrlBasedCorsConfigurationSource
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource(new PathPatternParser());
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }


    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthenticationFilterGateway jwtAuthenticationFilterGateway) {
        return builder.routes()

                // Auth không cần filter
                .route("auth-route", r -> r.path("/auth/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthenticationFilterGateway))
                        .uri("lb://auth-service"))

                // Các service khác cần verify token
                .route("item-route", r -> r.path("/items/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthenticationFilterGateway))
                        .uri("lb://item-service"))

                .route("booking-route", b -> b.path("/bookings/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthenticationFilterGateway))
                        .uri("lb://booking-service"))
                .route("mail-route", b -> b.path("/mail/**")
                        .filters(f -> f.stripPrefix(1).filter(jwtAuthenticationFilterGateway))
                        .uri("lb://mail-service"))

                .build();
    }
}
