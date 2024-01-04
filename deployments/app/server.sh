#!/usr/bin/env bash

cat <<EOT > /workspace/frontend/env.js
window.env = {
  baseApiUrl: "/api"
};
EOT

echo "Starting node backend on port 3001"
PORT=3001 node backend/index.js &

echo "Starting nginx on port $PORT"
mkdir /workspace/logs
nginx -p /workspace -c /workspace/nginx.conf &

wait -n
