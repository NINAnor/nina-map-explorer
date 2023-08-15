FROM nginx

COPY index.html /usr/share/nginx/html/
COPY assets/map.js assets/style.css /usr/share/nginx/html/assets/

