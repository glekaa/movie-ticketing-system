#!/bin/bash
set -e

# Get the directory of this script to ensure docker commands work from anywhere
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=== Seeding Auth Database ==="
docker compose exec -T auth-service uv run python -m app.seed

echo "=== Seeding Movie Database ==="
docker compose exec -T movie-service uv run python -m app.seed

echo "=== Database Seeding Completed Successfully! ==="
