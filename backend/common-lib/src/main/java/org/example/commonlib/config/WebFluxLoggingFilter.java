package org.example.commonlib.config;

import io.micrometer.observation.Observation;
import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.TraceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.util.context.ContextView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WebFluxLoggingFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(WebFluxLoggingFilter.class);

    private static final String OBSERVATION_ATTRIBUTE = "org.springframework.web.filter.reactive.ServerHttpObservationFilter.observation";

    private final Tracer tracer;

    public WebFluxLoggingFilter(Tracer tracer) {
        this.tracer = tracer;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE; // Run after the tracing filter
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        long startTime = System.currentTimeMillis();
        ServerHttpRequest request = exchange.getRequest();
        String method = request.getMethod().name();
        String uri = request.getURI().getPath();
        String queryString = request.getURI().getQuery();
        String maskedQueryString = MaskingUtils.maskQueryString(queryString);
        String fullPath = maskedQueryString != null ? uri + "?" + maskedQueryString : uri;
        String clientIp = request.getRemoteAddress() != null ? request.getRemoteAddress().toString() : "unknown";

        // Extract user id
        String userId = request.getHeaders().getFirst("X-User-Id");
        if (userId == null || userId.isEmpty()) {
            userId = "anonymous";
        }

        // Mask headers
        Map<String, List<String>> headersMap = new HashMap<>(request.getHeaders());
        String maskedHeaders = MaskingUtils.maskHeaders(headersMap);

        String finalUserId = userId;

        return Mono.deferContextual(contextView -> {
            // Retrieve active observation to restore thread local context
            Observation observation = exchange.getAttribute(OBSERVATION_ATTRIBUTE);
            if (observation == null) {
                Object obsObj = contextView.getOrDefault("micrometer.observation", null);
                if (obsObj instanceof Observation) {
                    observation = (Observation) obsObj;
                }
            }

            if (observation != null) {
                try (Observation.Scope scope = observation.openScope()) {
                    logIncomingRequest(method, fullPath, clientIp, maskedHeaders, finalUserId);
                }
            } else {
                logIncomingRequest(method, fullPath, clientIp, maskedHeaders, finalUserId);
            }

            return chain.filter(exchange);
        })
                .contextWrite(context -> context.put("userId", finalUserId)) // Store in Reactor Context for downstream
                                                                             // propagation
                .doOnEach(signal -> {
                    // This triggers on success/error/complete. We only log on terminal states
                    // (complete/error)
                    if (signal.isOnComplete() || signal.isOnError()) {
                        long duration = System.currentTimeMillis() - startTime;
                        int status = exchange.getResponse().getStatusCode() != null
                                ? exchange.getResponse().getStatusCode().value()
                                : 200;

                        Observation observation = exchange.getAttribute(OBSERVATION_ATTRIBUTE);
                        if (observation == null) {
                            Object obsObj = signal.getContextView().getOrDefault("micrometer.observation", null);
                            if (obsObj instanceof Observation) {
                                observation = (Observation) obsObj;
                            }
                        }

                        if (observation != null) {
                            try (Observation.Scope scope = observation.openScope()) {
                                logOutgoingResponse(method, fullPath, status, duration, finalUserId, signal);
                            }
                        } else {
                            logOutgoingResponse(method, fullPath, status, duration, finalUserId, signal);
                        }
                    }
                });
    }

    private void logIncomingRequest(String method, String fullPath, String clientIp, String maskedHeaders,
            String userId) {
        String traceId = getTraceId();
        String spanId = getSpanId();

        try (MDC.MDCCloseable c1 = MDC.putCloseable("userId", userId);
                MDC.MDCCloseable c2 = MDC.putCloseable("traceId", traceId);
                MDC.MDCCloseable c3 = MDC.putCloseable("spanId", spanId)) {
            log.info("Incoming Request: {} {} | Client: {} | Headers: {} | User: {}",
                    method, fullPath, clientIp, maskedHeaders, userId);
        }
    }

    private void logOutgoingResponse(String method, String fullPath, int status, long duration, String userId,
            reactor.core.publisher.Signal<?> signal) {
        String traceId = getTraceId();
        String spanId = getSpanId();

        try (MDC.MDCCloseable c1 = MDC.putCloseable("userId", userId);
                MDC.MDCCloseable c2 = MDC.putCloseable("traceId", traceId);
                MDC.MDCCloseable c3 = MDC.putCloseable("spanId", spanId)) {

            if (signal.isOnError()) {
                log.error("Outgoing Response: {} {} | Status: {} | Duration: {}ms | User: {} | Error: {}",
                        method, fullPath, status, duration, userId, signal.getThrowable().getMessage());
            } else {
                log.info("Outgoing Response: {} {} | Status: {} | Duration: {}ms | User: {}",
                        method, fullPath, status, duration, userId);
            }
        }
    }

    private String getTraceId() {
        if (tracer != null && tracer.currentSpan() != null) {
            TraceContext context = tracer.currentSpan().context();
            return context.traceId();
        }
        return MDC.get("traceId");
    }

    private String getSpanId() {
        if (tracer != null && tracer.currentSpan() != null) {
            TraceContext context = tracer.currentSpan().context();
            return context.spanId();
        }
        return MDC.get("spanId");
    }
}
