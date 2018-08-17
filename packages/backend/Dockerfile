FROM node:10.9.0-alpine

WORKDIR /usr/src/UniqueRecruitmentBackend

COPY package.json .

RUN npm install

COPY src .

CMD [ "npm", "start" ]
