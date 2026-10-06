#!/usr/bin/env bash
# Builds the app with the given deployment id and serves it on port 3000,
# replacing whatever build was there before, like a self-hosted redeploy.
# Usage: ./scripts/deploy.sh build-a   (later: ./scripts/deploy.sh build-b)
set -euo pipefail
id="${1:?usage: deploy.sh <deployment-id>}"
cd "$(dirname "$0")/.."
rm -rf .next
DEPLOYMENT_ID="$id" npx next build
DEPLOYMENT_ID="$id" exec npx next start -p 3000
