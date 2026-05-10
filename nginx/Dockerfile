FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM nginx:1.25

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=frontend-build /app/dist /usr/share/nginx/html
