package org.example.commonlib.config;

import feign.RequestInterceptor;
import io.micrometer.context.ContextRegistry;
import io.micrometer.tracing.Tracer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;

import jakarta.servlet.http.HttpServletRequest;

@AutoConfiguration
public class WebLoggingAutoConfiguration {

    // Static block to register MDC accessor for Reactor context propagation early
    static {
        try {
            System.setProperty("reactor.context-propagation", "auto");
            ContextRegistry.getInstance().registerThreadLocalAccessor(new MdcThreadLocalAccessor());
            System.out.println("=== WebLoggingAutoConfiguration: MdcThreadLocalAccessor registered successfully and reactor.context-propagation=auto set ===");
        } catch (Throwable t) {
            System.err.println("=== WebLoggingAutoConfiguration: Failed to register MdcThreadLocalAccessor: " + t.getMessage());
        }
    }

    // --- WebMvc Configuration (Servlet-based microservices) ---
    @AutoConfiguration
    @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
    public static class WebMvcLoggingConfiguration {

        @Bean
        public WebMvcLoggingFilter webMvcLoggingFilter(ObjectProvider<Tracer> tracerProvider) {
            return new WebMvcLoggingFilter(tracerProvider.getIfAvailable());
        }

        @Bean
        public FilterRegistrationBean<WebMvcLoggingFilter> webMvcLoggingFilterRegistration(WebMvcLoggingFilter filter) {
            FilterRegistrationBean<WebMvcLoggingFilter> registration = new FilterRegistrationBean<>(filter);
            // Run after the micrometer tracing filter (which runs at HIGHEST_PRECEDENCE + 5)
            registration.setOrder(Ordered.HIGHEST_PRECEDENCE + 10);
            return registration;
        }
    }

    // --- WebFlux Configuration (Reactive-based Gateway / services) ---
    @AutoConfiguration
    @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
    public static class WebFluxLoggingConfiguration {

        @Bean
        public WebFluxLoggingFilter webFluxLoggingFilter(ObjectProvider<Tracer> tracerProvider) {
            return new WebFluxLoggingFilter(tracerProvider.getIfAvailable());
        }
    }

    // --- Feign Configuration (Downstream client propagation) ---
    @AutoConfiguration
    @ConditionalOnClass({RequestInterceptor.class, HttpServletRequest.class})
    public static class FeignLoggingConfiguration {

        @Bean
        public RequestInterceptor feignUserHeaderInterceptor() {
            return new FeignUserHeaderInterceptor();
        }
    }
}
