# React
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Only keep built assets
FROM alpine:3.19

WORKDIR /frontend-build

COPY --from=build /app/dist .
