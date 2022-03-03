FROM node:alpine as common
WORKDIR /usr/src/recruitment
COPY . .
ENV YARN_CACHE_FOLDER /tmp/yarn-cache
RUN yarn set version berry \
    && yarn config set npmRegistryServer https://registry.npm.taobao.org \
    && yarn \
    && yarn workspace @uniqs/config build \
    && yarn workspace @uniqs/ui build \
    && yarn workspace @uniqs/utils build \
    && yarn workspace @uniqs/apis build \
    && rm -rf /tmp/yarn-cache

FROM common as backend
RUN yarn workspace @uniqs/backend build
CMD [ "yarn", "workspace", "@uniqs/backend", "start:prod" ]

FROM common as dashboard
RUN yarn workspace @uniqs/dashboard build

FROM common as candidate-dashboard
RUN yarn workspace @uniqs/candidate-dashboard compile \
    && yarn workspace @uniqs/candidate-dashboard build
CMD [ "yarn", "workspace", "@uniqs/candidate-dashboard", "start:prod" ]
