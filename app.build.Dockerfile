FROM php:7.2-apache as backend
RUN apt update && apt install -y git zip unzip
COPY --from=composer/composer:2.4.4-bin /composer /usr/bin/composer
WORKDIR /app
COPY ./backend .
RUN composer install && composer dump-autoload -o && rm composer.*

FROM node:16.18-alpine as frontend
WORKDIR /app
COPY ./frontend .
RUN yarn install && yarn build

FROM php:7.2-apache
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite
WORKDIR /var/www/html
COPY --from=backend /app .
COPY --from=frontend /app/dist .
