FROM php:7.2-apache
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite
RUN apt update && apt install -y git zip unzip
COPY --from=composer/composer:2.4.4-bin /composer /usr/bin/composer
