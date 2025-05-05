#!/bin/bash
echo "Starting server..."
node server/server.js &
server_pid=$!

sleep 1

echo "Starting Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:3000

echo "Cleaning up..."
kill $server_pid
