FROM node:10.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/dashboard

COPY package.json .

RUN yarn

COPY . .

RUN yarn build
