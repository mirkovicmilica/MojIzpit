#!/bin/bash
echo "Running pre-start commands..."
curl -X POST http://webserver:8000/register \
  -H "Content-Type: application/json" \
  -d '{
        "seed": "seed2"
      }'

echo "Starting aca-py agent..."
#exec aca-py "$@"
poetry run aca-py "$@"
