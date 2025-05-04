#!/bin/bash
echo "Starting WebSocket server..."
node server/server.js &

sleep 2
echo "Starting Cloudflare Tunnel..."
cloudflared tunnel --url http://localhost:3000
