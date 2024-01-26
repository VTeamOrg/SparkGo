# Dockerfile for the backend solution of sparkgo
FROM ubuntu:22.04
RUN apt-get update && \
    apt-get install -y curl sudo nmap && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    sudo apt-get install -y nodejs

COPY config /backend/config
COPY controllers /backend/controllers
COPY data /backend/data
COPY db /backend/db
COPY middleware /backend/middleware
COPY models /backend/models
COPY routes /backend/routes
COPY utils /backend/utils

WORKDIR /backend

COPY .env app.js package.json .scrutinizer.yml ./
RUN npm install

CMD ["node","app.js"]
