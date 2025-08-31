package jmaster.io.gatewayservice;

import jmaster.io.gatewayservice.filter.AuthenticationFilter;
import jmaster.io.gatewayservice.filter.LoggingGatewayFilterFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class GatewayserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayserviceApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder, LoggingGatewayFilterFactory loggingFactory, AuthenticationFilter authenticationFilter) {
        return builder.routes()
                .route("auth-route", r -> r.path("/auth/**")
                        .filters(f -> f.stripPrefix(1)
                                .filter(loggingFactory.apply(new LoggingGatewayFilterFactory.Config()))
//                                .circuitBreaker(c -> c.setName("CircuitBreaker")
//                                        .getFallbackUri())
                )
                        .uri("lb://authentication-service"))
                .route("item-route", r -> r.path("/item/**")
                        .filters(f -> f.stripPrefix(1)
                                .filter(loggingFactory.apply(new LoggingGatewayFilterFactory.Config()))
                                        .filter(authenticationFilter.apply(new AuthenticationFilter.Config()))
//                                .circuitBreaker(c -> c.setName("CircuitBreaker")
//                                        .getFallbackUri())
                        )
                        .uri("lb://item-service"))
                .route("user-route", r -> r.path("/user/**")
                        .filters(f -> f.stripPrefix(1)
                                .filter(loggingFactory.apply(new LoggingGatewayFilterFactory.Config()))
                                .filter(authenticationFilter.apply(new AuthenticationFilter.Config()))
                                .circuitBreaker(c -> c.setName("CircuitBreaker")
                                        .getFallbackUri()))
                        .uri("lb://account-service"))

                .route("report-route", r -> r.path("/report/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://statistic-service"))

                .route("notification-route", r -> r.path("/notification/**")
                        .filters(f -> f.stripPrefix(1))
                        .uri("lb://notification-service"))

                ///swagger ui
                .route("openapi", r -> r.path("/v3/api-docs/**")
                        .filters(f -> f.rewritePath("/v3/api-docs/(?<service>.*)", "/${service}/v3/api-docs"))
                        .uri("lb://gateway-service"))
                .build();
    }
}
