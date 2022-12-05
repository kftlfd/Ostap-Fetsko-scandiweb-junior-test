#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
docker run --rm -it \
    -v "$dir:/app" \
    -w "/app" \
    --expose "5173" -p "5173:5173" \
    --entrypoint "/usr/local/bin/yarn" \
    node:16.18-alpine $@