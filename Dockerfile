FROM node:18 as frontend
WORKDIR /app
COPY package.json package-lock.json .
RUN npm i
COPY src src/
COPY public public/
COPY vite.config.js index.html .

CMD ["npm", "run", "dev"]

FROM frontend as build
RUN npm run build

FROM nginx

COPY nginx/default.conf.template /etc/nginx/templates/
COPY --from=build /app/dist /var/www/
