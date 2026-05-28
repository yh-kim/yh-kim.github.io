#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8074}"
PIDS="$(lsof -tiTCP:"$PORT" -sTCP:LISTEN || true)"

if [ -z "$PIDS" ]; then
  echo "No server is listening on port $PORT."
  exit 0
fi

echo "$PIDS" | xargs kill
echo "Stopped server on port $PORT."
