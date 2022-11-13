FROM node:16.18-alpine as frontend
WORKDIR /app
COPY ./frontend .
RUN yarn install && yarn build

FROM php:7.2-apache
WORKDIR /var/www/html
COPY ./backend .
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite && \
    composer install
COPY --from=frontend /app/dist /var/www/html
