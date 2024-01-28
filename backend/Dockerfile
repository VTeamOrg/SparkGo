FROM node:21-alpine3.18

WORKDIR /backend

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
