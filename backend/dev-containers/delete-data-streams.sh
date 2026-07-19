#!/bin/bash
echo "Deleting Elasticsearch data streams..."
curl -s -X DELETE "http://localhost:9200/_data_stream/logs-*"
echo "Done."
