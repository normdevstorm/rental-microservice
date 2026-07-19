package org.example.commonlib.config;

import io.micrometer.tracing.Tracer;
import io.micrometer.tracing.TraceContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WebMvcLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(WebMvcLoggingFilter.class);
    
    private final Tracer tracer;

    public WebMvcLoggingFilter(Tracer tracer) {
        this.tracer = tracer;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String maskedQueryString = MaskingUtils.maskQueryString(queryString);
        String fullPath = maskedQueryString != null ? uri + "?" + maskedQueryString : uri;
        String clientIp = request.getRemoteAddr();

        // Extract user id and put in MDC
        String userId = request.getHeader("X-User-Id");
        if (userId == null || userId.isEmpty()) {
            userId = "anonymous";
        }
        MDC.put("userId", userId);

        // Try to populate traceContext in MDC early if present
        populateTraceContext();

        // Build masked headers map for logging
        Map<String, List<String>> headersMap = new HashMap<>();
        Collections.list(request.getHeaderNames()).forEach(headerName -> 
            headersMap.put(headerName, Collections.list(request.getHeaders(headerName)))
        );
        String maskedHeaders = MaskingUtils.maskHeaders(headersMap);

        try {
            log.info("Incoming Request: {} {} | Client: {} | Headers: {} | User: {}", 
                    method, fullPath, clientIp, maskedHeaders, userId);
            
            filterChain.doFilter(request, response);
        } finally {
            // Re-populate traceContext in MDC just in case threads changed or trace started late
            populateTraceContext();
            
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            log.info("Outgoing Response: {} {} | Status: {} | Duration: {}ms | User: {}", 
                    method, fullPath, status, duration, userId);
            
            MDC.remove("userId");
            MDC.remove("traceId");
            MDC.remove("spanId");
        }
    }

    private void populateTraceContext() {
        if (tracer != null && tracer.currentSpan() != null) {
            TraceContext context = tracer.currentSpan().context();
            if (MDC.get("traceId") == null && context.traceId() != null) {
                MDC.put("traceId", context.traceId());
            }
            if (MDC.get("spanId") == null && context.spanId() != null) {
                MDC.put("spanId", context.spanId());
            }
        }
    }
}
