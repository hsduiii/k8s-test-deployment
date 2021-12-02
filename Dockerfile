FROM node:14-alpine AS build
WORKDIR /app
COPY . .
RUN npm install

FROM node:14-alpine AS run
WORKDIR /app
COPY --from=build ./app ./
COPY package* ./
RUN npm install --production

EXPOSE 3000

CMD node src/main.js
