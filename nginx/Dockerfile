# Build React
FROM node:20-alpine AS frontend-build

WORKDIR /app
COPY ../frontend/package*.json ./
RUN npm install

COPY ../frontend .
RUN npm run build

# Production Nginx
FROM nginx:alpine

COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY nginx.prod.conf.template /etc/nginx/templates/default.conf.template
