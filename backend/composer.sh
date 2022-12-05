#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
docker run --rm -it \
    -v "$dir:/app" \
    -w "/app" \
    composer/composer:2.4.4 $@