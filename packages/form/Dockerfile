FROM node:alpine

RUN npm install -g yarn

WORKDIR /usr/share/nginx/form

COPY package.json .

RUN yarn

COPY . .

RUN yarn build
