FROM php:7.2-apache
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite
