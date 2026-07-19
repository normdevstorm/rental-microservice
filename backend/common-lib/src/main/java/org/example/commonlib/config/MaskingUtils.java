package org.example.commonlib.config;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class MaskingUtils {

    private static final List<String> SENSITIVE_KEYS = Arrays.asList(
            "password", "secret", "token", "email", "phone", "card", "cvv", "authorization", "cookie"
    );

    // Regex to match JSON fields, e.g., "password" : "value"
    private static final Pattern JSON_PATTERN = Pattern.compile(
            "\"(password|secret|token|email|phone|card|cvv|authorization|cookie)\"\\s*:\\s*\"([^\"]+)\"",
            Pattern.CASE_INSENSITIVE
    );

    // Regex to match query parameters, e.g., password=value
    private static final Pattern QUERY_PATTERN = Pattern.compile(
            "([^&?\\s]*)(password|secret|token|email|phone|card|cvv|authorization|cookie)=([^&\\s]*)",
            Pattern.CASE_INSENSITIVE
    );

    public static String maskJson(String json) {
        if (json == null || json.isEmpty()) {
            return json;
        }
        Matcher matcher = JSON_PATTERN.matcher(json);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            matcher.appendReplacement(sb, "\"" + matcher.group(1) + "\":\"******\"");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    public static String maskQueryString(String queryString) {
        if (queryString == null || queryString.isEmpty()) {
            return queryString;
        }
        Matcher matcher = QUERY_PATTERN.matcher(queryString);
        StringBuilder sb = new StringBuilder();
        while (matcher.find()) {
            matcher.appendReplacement(sb, matcher.group(1) + matcher.group(2) + "=******");
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    public static String maskHeaders(Map<String, ? extends List<String>> headers) {
        if (headers == null || headers.isEmpty()) {
            return "{}";
        }
        return headers.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            String key = entry.getKey().toLowerCase();
                            if (SENSITIVE_KEYS.contains(key)) {
                                return List.of("******");
                            }
                            return entry.getValue();
                        }
                )).toString();
    }

    public static String maskSingleHeader(String name, String value) {
        if (name == null || value == null) {
            return value;
        }
        if (SENSITIVE_KEYS.contains(name.toLowerCase())) {
            return "******";
        }
        return value;
    }
}
