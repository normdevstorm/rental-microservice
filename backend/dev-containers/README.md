# Elasticsearch Centralized Logging Setup

This directory contains the configurations and scripts for the Elasticsearch centralized logging infrastructure integrated into the microservices observability stack.

## Architecture

The system utilizes a dual-sink log pipeline:
- **Loki**: Serves existing Grafana dashboards and label-based log queries.
- **Elasticsearch**: Enables full-text search, structured field queries, Kibana-based debugging dashboards, and index lifecycle management.

## Services & Ports

Once the stack is running, the following endpoints are exposed locally:
- **Elasticsearch**: [http://localhost:9200](http://localhost:9200)
- **Kibana**: [http://localhost:5601](http://localhost:5601)
- **Logstash**: `localhost:5044` (HTTP input receiver)

## Getting Started

1. Start the observability stack services:
   ```bash
   docker compose -f docker-compose.observability.yml up -d
   ```

2. Provision the Elasticsearch index lifecycle policy, templates, and Kibana data views:
   ```bash
   bash setup-elasticsearch.sh
   ```

## Static Validation

To run static configuration consistency checks (e.g., in CI/CD pipelines):
```bash
bash validate-config.sh
```
