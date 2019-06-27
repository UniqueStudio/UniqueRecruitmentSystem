FROM node:12.4.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/backend

COPY package.json .

RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "startProd" ]
