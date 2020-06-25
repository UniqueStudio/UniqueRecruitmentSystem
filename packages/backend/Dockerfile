FROM node:alpine

WORKDIR /usr/src/backend

COPY . .

RUN yarn

RUN yarn build

CMD [ "yarn", "startProd" ]
