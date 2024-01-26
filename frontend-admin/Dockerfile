# Dockerfile for the backend solution of sparkgo
FROM ubuntu:22.04
RUN apt-get update && \
    apt-get install -y curl sudo && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    sudo apt-get install -y nodejs

COPY public /frontend-admin/public
COPY src /frontend-admin/src

WORKDIR /frontend-admin

COPY config.js index.html package.json vite.config.js ./
RUN npm install

CMD ["npm","run","dev"]
