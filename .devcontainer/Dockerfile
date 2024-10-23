# https://hub.docker.com/r/microsoft/devcontainers-php
FROM mcr.microsoft.com/devcontainers/php:7.4

RUN docker-php-ext-install pdo pdo_mysql \
    && a2enmod rewrite
