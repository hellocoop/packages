# test Dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY  ../package.json ./
RUN npm ci
COPY ./ ./
EXPOSE 8080
