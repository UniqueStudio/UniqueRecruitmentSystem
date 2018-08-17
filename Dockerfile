FROM node:10.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/dashboard

COPY package.json .

RUN yarn

RUN yarn build

COPY . .

CMD [ "yarn", "start", "build" ]

FROM nginx:1.15.2-alpine
COPY nginx.conf /etc/nginx/