#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
docker run --rm \
    -w "/app" \
    -v "$dir:/app" \
    --entrypoint "/app/vendor/bin/phpunit" \
    app/dev \
    tests