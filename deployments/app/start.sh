#!/usr/bin/env bash

cat <<EOT > /workspace/frontend/env.js
window.env = {
  baseApiUrl: "/api"
};
EOT

mkfifo /tmp/logs

echo "Starting node backend on port 3001"
PORT=3001 node backend/index.js 2>&1 | tee /tmp/logs &

echo "Starting nginx on port $PORT"
nginx -p /workspace -c /workspace/nginx.conf 2>&1 | tee /tmp/logs &

tail -f /tmp/logs
