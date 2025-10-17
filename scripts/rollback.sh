#!/bin/bash
set -e

SNAP_INPUT="$1"
REMOTE_DIR=~/sat18-deploy

ssh -p ${VPS_PORT:-22} ${VPS_USER}@${VPS_HOST} <<EOF
set -e
cd $REMOTE_DIR
pm2 stop sat18-proxy || true
if [ -z "$SNAP_INPUT" ]; then
  SNAP=$(ls -t snapshots | head -n 1)
else
  SNAP="$SNAP_INPUT"
fi
if [ -z "$SNAP" ]; then
  echo "Tidak ada snapshot ditemukan."; exit 1
fi
echo "Rollback ke snapshot: $SNAP"
rm -rf current/*
tar -xzf snapshots/$SNAP -C current
pm2 start server/ecosystem.config.js --only sat18-proxy || true
pm2 restart sat18-proxy || pm2 start server/ecosystem.config.js --only sat18-proxy
pm2 save
EOF

echo "Rollback selesai."
