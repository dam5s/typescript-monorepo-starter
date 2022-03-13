#!/usr/bin/env bash

PORT=3001 node backend/index.js &

cat <<EOT > /workspace/frontend/env.js
window.env = {
  baseApiUrl: "/api"
};
EOT

echo "Starting nginx on port $PORT"

nginx -p /workspace -c /workspace/nginx.conf
