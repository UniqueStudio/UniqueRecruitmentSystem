FROM node:10.9.0-alpine

RUN npm install -g yarn

RUN mkdir /usr/src/dashboard

WORKDIR /usr/src/dashboard

COPY package.json .

RUN yarn

COPY . .

RUN yarn build