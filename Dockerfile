# Dockerfile
FROM php:8.2-apache

# Habilitamos mod_rewrite
RUN a2enmod rewrite

# Copiamos el contenido del proyecto al contenedor
COPY . /var/www/html/

# Definir directorio público como raíz del sitio
WORKDIR /var/www/html/public

# Establecer permisos
RUN chown -R www-data:www-data /var/www/html
