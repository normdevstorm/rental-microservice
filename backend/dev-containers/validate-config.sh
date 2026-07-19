#!/usr/bin/env bash
# validate-config.sh
# Static configuration validation script for the Elasticsearch centralized logging integration.
# Exit code is non-zero if any assertion fails.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.observability.yml"
OTEL_CONFIG_FILE="${SCRIPT_DIR}/otel-collector-config.yaml"
LOGSTASH_CONF_FILE="${SCRIPT_DIR}/logstash/pipeline/logstash.conf"
SETUP_SCRIPT_FILE="${SCRIPT_DIR}/setup-elasticsearch.sh"

FAILED=0

assert_contains_literal() {
    local file="$1"
    local string="$2"
    local desc="$3"
    
    if grep -F -q "$string" "$file"; then
        echo -e "\e[32m[PASS]\e[0m $desc"
    else
        echo -e "\e[31m[FAIL]\e[0m $desc"
        echo "       Literal string not found: $string"
        FAILED=1
    fi
}

assert_contains_regex() {
    local file="$1"
    local pattern="$2"
    local desc="$3"
    
    if grep -E -q "$pattern" "$file"; then
        echo -e "\e[32m[PASS]\e[0m $desc"
    else
        echo -e "\e[31m[FAIL]\e[0m $desc"
        echo "       Pattern not found: $pattern"
        FAILED=1
    fi
}

echo "Starting static configuration validation..."

# 1. Assert docker-compose.observability.yml contains services
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "elasticsearch:" "docker-compose.observability.yml contains elasticsearch service"
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "logstash:" "docker-compose.observability.yml contains logstash service"
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "kibana:" "docker-compose.observability.yml contains kibana service"

# 2. Assert image versions are exactly 8.13.0
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "image: elasticsearch:8.13.0" "Elasticsearch image is exactly elasticsearch:8.13.0"
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "image: logstash:8.13.0" "Logstash image is exactly logstash:8.13.0"
assert_contains_literal "${DOCKER_COMPOSE_FILE}" "image: kibana:8.13.0" "Kibana image is exactly kibana:8.13.0"

# 3. Assert otel-collector-config.yaml logs pipeline
assert_contains_literal "${OTEL_CONFIG_FILE}" "otlphttp/logstash" "otel-collector-config.yaml contains otlphttp/logstash exporter"
assert_contains_literal "${OTEL_CONFIG_FILE}" "otlphttp/loki" "otel-collector-config.yaml contains otlphttp/loki exporter"
assert_contains_regex "${OTEL_CONFIG_FILE}" "processors: \[.*batch.*\]" "otel-collector-config.yaml logs pipeline processors contains batch"

# 4. Assert logstash/pipeline/logstash.conf contains the index pattern
assert_contains_literal "${LOGSTASH_CONF_FILE}" 'index => "logs-%{[service]}-%{+YYYY.MM.dd}"' "logstash.conf output index pattern matches logs-%{[service]}-%{+YYYY.MM.dd}"

# 5. Assert setup-elasticsearch.sh contains ILM policy, index template, and Kibana data view creation
assert_contains_literal "${SETUP_SCRIPT_FILE}" "logs-policy" "setup-elasticsearch.sh contains ILM policy logs-policy"
assert_contains_literal "${SETUP_SCRIPT_FILE}" "logs-template" "setup-elasticsearch.sh contains index template logs-template"
assert_contains_literal "${SETUP_SCRIPT_FILE}" "logs-*" "setup-elasticsearch.sh contains Kibana data view logs-*"

if [ $FAILED -ne 0 ]; then
    echo -e "\n\e[31mValidation FAILED!\e[0m"
    exit 1
else
    echo -e "\n\e[32mValidation PASSED!\e[0m"
    exit 0
fi
