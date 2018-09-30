FROM ubuntu:18.04

RUN apt-get update && \
    apt-get install --yes nodejs npm curl build-essential

RUN npm cache clean && \
    npm install -g n && \
    npm install -g yarn && \
    npm install -g nodemon && \
    ln -sf /usr/local/bin/node /usr/bin/node

RUN n 8.11.0

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN mkdir /backend
WORKDIR /backend
ADD package.json /backend/
ADD yarn.lock /backend/
RUN yarn