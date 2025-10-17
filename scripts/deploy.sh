#!/bin/bash
set -e

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
REMOTE_DIR=~/sat18-deploy

echo "Build..."
npm run build

echo "Archive..."
mkdir -p artifacts
tar -czf artifacts/sat18-dist.tar.gz -C dist .

echo "Prepare dirs & snapshot on VPS..."
ssh -p ${VPS_PORT:-22} ${VPS_USER}@${VPS_HOST} <<EOF
mkdir -p $REMOTE_DIR/snapshots
mkdir -p $REMOTE_DIR/current
if [ -n "$(ls -A $REMOTE_DIR/current 2>/dev/null)" ]; then
  tar -czf $REMOTE_DIR/snapshots/snapshot-$TIMESTAMP.tar.gz -C $REMOTE_DIR/current .
  echo "Snapshot dibuat: snapshot-$TIMESTAMP.tar.gz"
fi
EOF

echo "Upload artifact..."
scp -P ${VPS_PORT:-22} artifacts/sat18-dist.tar.gz ${VPS_USER}@${VPS_HOST}:$REMOTE_DIR/

echo "Unpack & restart..."
ssh -p ${VPS_PORT:-22} ${VPS_USER}@${VPS_HOST} <<'EOF'
set -e
REMOTE_DIR=~/sat18-deploy
cd $REMOTE_DIR
rm -rf current/*
tar -xzf sat18-dist.tar.gz -C current
rm -f sat18-dist.tar.gz
pm2 start server/ecosystem.config.js --only sat18-proxy || true
pm2 restart sat18-proxy || pm2 start server/ecosystem.config.js --only sat18-proxy
pm2 save
EOF

echo "Done."
