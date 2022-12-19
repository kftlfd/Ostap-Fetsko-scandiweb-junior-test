#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
docker run --rm -it \
    -w "/app" \
    -v "$dir:/app" \
    --entrypoint "/usr/bin/composer" \
    app/dev $@