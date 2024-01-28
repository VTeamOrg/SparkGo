FROM node:21-alpine3.18 as builder

WORKDIR /webapp

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

#Stage 2
FROM nginx:1.25.3
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ./*
COPY --from=builder /webapp/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
