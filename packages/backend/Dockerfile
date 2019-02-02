FROM node:11.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/backend

COPY package.json .

RUN yarn

COPY . .

CMD [ "yarn", "start", "build" ]
