#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public
curl -fsSL https://prestocks.com/api/prestocks -o public/prestocks.json
npm ci
npm run build
rm -rf docs && mkdir docs && cp -r dist/* docs/ && touch docs/.nojekyll
echo "Refreshed public/prestocks.json and docs/"
