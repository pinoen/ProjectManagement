#!/bin/bash
cd "$(dirname "$0")"

if [ -f ../.env ]; then
  export $(grep -v '^#' ../.env | xargs)
else
  echo ".env file not found, skipping..."
fi

exec node dist/main.js