FROM nginx

COPY nginx/default.conf.template /etc/nginx/templates/
COPY viewer.html /var/www/
COPY assets/map.js assets/style.css /var/www/assets/

