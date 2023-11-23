FROM node:18
WORKDIR /app
COPY package.json package-lock.json .
RUN npm i
COPY src src/
COPY public public/
COPY vite.config.js index.html .

CMD ["npm", "run", "dev"]
