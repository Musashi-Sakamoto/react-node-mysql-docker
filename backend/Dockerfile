FROM node:8.11

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir /backend
WORKDIR /backend
ADD package.json /backend/
ADD yarn.lock /backend/
RUN yarn