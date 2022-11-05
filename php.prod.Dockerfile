FROM node:16.18-alpine as frontend
WORKDIR /app
COPY ./frontend .
RUN yarn install && yarn build

FROM php:7.2-apache
RUN docker-php-ext-install pdo pdo_mysql && \
    a2enmod rewrite
COPY ./backend/dist /var/www/html
COPY --from=frontend /app/dist /var/www/html
