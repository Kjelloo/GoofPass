FROM node:latest AS build

WORKDIR /usr/local/app

COPY ./ /usr/local/app

RUN npm install

RUN npm run build

# Serve Application using Nginx Server

FROM nginx:latest

COPY --from=build /usr/local/app/dist/goof-pass.client/ /usr/share/nginx/html

EXPOSE 80
