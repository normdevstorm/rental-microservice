package org.example.commonlib.config;

import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.instrumentation.logback.appender.v1_0.OpenTelemetryAppender;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
@ConditionalOnClass({OpenTelemetry.class, OpenTelemetryAppender.class})
public class OtelLoggingAutoConfiguration {

    @Bean
    public InitializingBean openTelemetryAppenderInitializer(OpenTelemetry openTelemetry) {
        return () -> {
            System.out.println("=== OtelLoggingAutoConfiguration: Installing OpenTelemetryAppender with bean ===");
            OpenTelemetryAppender.install(openTelemetry);
        };
    }
}
