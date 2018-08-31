FROM node:10.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/form

COPY package.json .

RUN yarn

COPY . .

RUN yarn build
