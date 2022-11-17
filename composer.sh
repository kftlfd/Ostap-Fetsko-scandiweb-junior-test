#!/bin/bash
docker run --rm -it \
    -v "$(pwd)/backend:/app" \
    -w "/app" \
    composer/composer:2.4.4 $@