#!/bin/sh
set -e

PORT="${PORT:-3000}"
echo "Starting static server on 0.0.0.0:$PORT"
exec serve dist -l "tcp://0.0.0.0:$PORT"
