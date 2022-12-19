FROM php:7.2-apache
WORKDIR /var/www/html
RUN docker-php-ext-install mysqli pdo pdo_mysql && \
    a2enmod rewrite