#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${1:-8074}"

"$ROOT/scripts/verify-all.sh"

echo "Serving _site at http://127.0.0.1:$PORT"
echo "Stop with Ctrl-C. If it stays alive, run: scripts/stop-site.sh $PORT"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$ROOT/_site"
