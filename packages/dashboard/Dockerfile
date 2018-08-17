FROM node:10.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/dashboard

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

FROM nginx:1.15.2-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]