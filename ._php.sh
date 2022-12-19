#!/bin/bash
dir="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
docker run --rm \
    -w "/app" \
    -v "$dir/backend:/app" \
    productsdb/dev \
    php $@
    