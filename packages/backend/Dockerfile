FROM node:10.9.0-alpine

RUN npm install -g yarn

WORKDIR /usr/src/UniqueRecruitmentBackend

COPY package.json .

RUN yarn

COPY . .

CMD [ "yarn", "start", "build" ]
