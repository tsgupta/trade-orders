FROM node:16.17.1
WORKDIR /usr/app
COPY . .
RUN npm install
