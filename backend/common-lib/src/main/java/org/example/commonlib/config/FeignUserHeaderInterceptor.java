package org.example.commonlib.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.MDC;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class FeignUserHeaderInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate template) {
        // 1. Try propagating from the Servlet Request Attributes if available
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            propagateHeader(request, template, "X-User-Id");
            propagateHeader(request, template, "X-User-Name");
            propagateHeader(request, template, "X-User-Roles");
            propagateHeader(request, template, "X-Device-Id");
        } else {
            // 2. Fallback to MDC values if running in a background or async thread
            String userId = MDC.get("userId");
            if (userId != null && !userId.equals("anonymous")) {
                template.header("X-User-Id", userId);
            }
        }
    }

    private void propagateHeader(HttpServletRequest request, RequestTemplate template, String headerName) {
        String value = request.getHeader(headerName);
        if (value != null && !value.isEmpty()) {
            template.header(headerName, value);
        }
    }
}
