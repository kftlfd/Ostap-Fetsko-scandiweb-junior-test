FROM composer/composer:2.4.4 as backend
WORKDIR /app
COPY ./backend .
RUN composer install && rm composer.json composer.lock

FROM node:16.18-alpine as frontend
WORKDIR /app
COPY ./frontend .
RUN yarn install && yarn build

FROM php:7.2-apache
WORKDIR /var/www/html
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite
    
COPY --from=backend /app .
COPY --from=frontend /app/dist .
