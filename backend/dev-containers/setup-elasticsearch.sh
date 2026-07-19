#!/usr/bin/env bash
# setup-elasticsearch.sh
# Provisions Elasticsearch ILM policy, index template, and Kibana data view
# after the ELK stack containers are healthy.
#
# Usage: bash setup-elasticsearch.sh
# Run once after: docker compose -f docker-compose.observability.yml up -d

ES_URL="http://localhost:9200"
KIBANA_URL="http://localhost:5601"

# ---------------------------------------------------------------------------
# Step 1: Wait for Elasticsearch to become available (max 60 seconds)
# ---------------------------------------------------------------------------
echo "[1/5] Waiting for Elasticsearch at ${ES_URL} ..."
ELAPSED=0
until curl -sf "${ES_URL}/_cluster/health" > /dev/null 2>&1; do
    if [ "${ELAPSED}" -ge 60 ]; then
        echo "ERROR: Elasticsearch did not become available within 60 seconds."
        exit 1
    fi
    sleep 2
    ELAPSED=$((ELAPSED + 2))
done
echo "      Elasticsearch is up."

# ---------------------------------------------------------------------------
# Step 2: Create the ILM policy (hot phase: no actions; delete phase: 7 days)
# ---------------------------------------------------------------------------
echo "[2/5] Creating ILM policy 'logs-policy' ..."
ILM_RESPONSE=$(curl -sf -o /dev/null -w "%{http_code}" \
    -X PUT "${ES_URL}/_ilm/policy/logs-policy" \
    -H "Content-Type: application/json" \
    -d '{
  "policy": {
    "phases": {
      "hot": {
        "actions": {}
      },
      "delete": {
        "min_age": "7d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}')

if [ "${ILM_RESPONSE}" != "200" ] && [ "${ILM_RESPONSE}" != "201" ]; then
    echo "ERROR: Failed to create ILM policy. HTTP status: ${ILM_RESPONSE}"
    exit 1
fi
echo "      ILM policy created (HTTP ${ILM_RESPONSE})."

# ---------------------------------------------------------------------------
# Step 3: Create the index template that applies logs-policy to logs-* indices
# ---------------------------------------------------------------------------
echo "[3/5] Creating index template 'logs-template' ..."
TEMPLATE_RESPONSE=$(curl -sf -o /dev/null -w "%{http_code}" \
    -X PUT "${ES_URL}/_index_template/logs-template" \
    -H "Content-Type: application/json" \
    -d '{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "logs-policy"
    }
  }
}')

if [ "${TEMPLATE_RESPONSE}" != "200" ] && [ "${TEMPLATE_RESPONSE}" != "201" ]; then
    echo "ERROR: Failed to create index template. HTTP status: ${TEMPLATE_RESPONSE}"
    exit 1
fi
echo "      Index template created (HTTP ${TEMPLATE_RESPONSE})."

# ---------------------------------------------------------------------------
echo "[4/5] Creating Kibana data view 'logs-*' ..."
KIBANA_OUT=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
    --retry 5 --retry-delay 5 \
    -X POST "${KIBANA_URL}/api/data_views/data_view" \
    -H "Content-Type: application/json" \
    -H "kbn-xsrf: true" \
    -d '{"data_view":{"title":"logs-*","timeFieldName":"@timestamp"}}')

KIBANA_STATUS=$(echo "${KIBANA_OUT}" | grep "HTTP_STATUS:" | cut -d':' -f2)
KIBANA_BODY=$(echo "${KIBANA_OUT}" | grep -v "HTTP_STATUS:")

if [ "${KIBANA_STATUS}" = "200" ] || [ "${KIBANA_STATUS}" = "201" ]; then
    echo "      Kibana data view created (HTTP ${KIBANA_STATUS})."
elif [ "${KIBANA_STATUS}" = "400" ] && echo "${KIBANA_BODY}" | grep -q "Duplicate data view"; then
    echo "      Kibana data view already exists (HTTP 400)."
else
    echo "ERROR: Failed to create Kibana data view. HTTP status: ${KIBANA_STATUS}"
    echo "Response: ${KIBANA_BODY}"
    exit 1
fi

# ---------------------------------------------------------------------------
# Step 5: Health check — poll for at least one logs-* index (max 60 seconds)
# ---------------------------------------------------------------------------
echo "[5/5] Health check: waiting for logs-* indices to appear (max 60s) ..."
ELAPSED=0
INDEX_FOUND=false
until [ "${INDEX_FOUND}" = "true" ]; do
    INDEX_LIST=$(curl -sf "${ES_URL}/_cat/indices/logs-*" 2>/dev/null)
    if [ -n "${INDEX_LIST}" ]; then
        INDEX_FOUND=true
    elif [ "${ELAPSED}" -ge 60 ]; then
        break
    else
        sleep 5
        ELAPSED=$((ELAPSED + 5))
    fi
done

if [ "${INDEX_FOUND}" = "true" ]; then
    echo ""
    echo "✓ Pipeline is operational"
    echo "  Kibana: ${KIBANA_URL}"
    echo "  Elasticsearch: ${ES_URL}"
else
    echo ""
    echo "⚠ No logs-* indices found after ${ELAPSED}s."
    echo "  Check OTel Collector and Logstash container logs:"
    echo "    docker compose -f docker-compose.observability.yml logs otel-collector"
    echo "    docker compose -f docker-compose.observability.yml logs logstash"
fi
