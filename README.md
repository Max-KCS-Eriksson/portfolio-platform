# Portfolio & Blog Platform

A Dockerized Django-based web application that serves as both a personal portfolio and a technical blogging platform.

The project was built with two goals in mind:

- Provide a maintainable way to manage and publish portfolio & blog content
- Gain hands-on experience deploying a full web stack in a Linux server environment

To simplify content administration, Django was chosen for both backend logic and server-rendered frontend templates, allowing all site content to be managed through Django's built-in admin interface.

---

## Why This Exists

This project was built as a practical full-stack deployment exercise rather than a static portfolio page.

It solves two real problems simultaneously:

- Managing portfolio & blog content without editing source files manually
- Understanding how a production web application is containerized, reverse proxied, secured with HTTPS, and deployed on a VPS

The result is a self-hosted application where both application logic and infrastructure setup are owned and maintained within the same project.

---

## Tech Stack

- Python
- Django
- Django Templates
- PostgreSQL
- Docker Compose
- Gunicorn
- Nginx
- Certbot
- Linux

---

## Core Features

- Dynamic portfolio project publishing through Django Admin
- Dynamic blog publishing through Django Admin
- Reusable server-rendered template structure
- Custom 404 and 500 status pages
- PostgreSQL-backed production persistence
- Reverse proxy via Nginx
- HTTPS termination using Let's Encrypt SSL certificates
- Containerized deployment using Docker Compose

---

## Application Structure

The application is split into dedicated Django apps:

- `core/` — shared layout, homepage, about page, static assets, global templates
- `portfolio/` — portfolio project models, views, templates, publishing logic
- `blog/` — blog post models, views, templates, tagging, publishing logic
- `users/` — custom user management

This keeps content domains isolated while allowing shared presentation and navigation logic to remain centralized.

---

## Production Architecture

The deployed production stack consists of four services:

### `web`

Runs the Django application through Gunicorn.

### `db`

Runs PostgreSQL as the persistent production database.

### `nginx`

Acts as:

- Reverse proxy
- Static file server
- HTTP → HTTPS redirect layer
- SSL termination point

### `certbot`

Used for manual Let's Encrypt certificate generation and renewal.

Docker volumes are used for:

- PostgreSQL data persistence
- Django static file persistence
- SSL certificate persistence

---

## Requirements

To deploy this project you need:

- Docker
- Docker Compose
- A Linux VPS
- A registered domain name pointing to the server
- Let's Encrypt certificate generation access
- A production `.env` file

Django production settings such as `SECRET_KEY`, `ALLOWED_HOSTS`, and database credentials are provided through environment variables rather than hardcoded settings.

---

## Environment Configuration

Create a `.env` file in the project root and provide values for:

```env
# Used by templates for info
DOMAIN_NAME=
SITE_OWNER=

# Certbot
EMAIL=
DOMAIN=

# Django settings
SECRET_KEY=
DJANGO_ALLOWED_HOSTS=
DJANGO_CSRF_TRUSTED_ORIGINS=
SQL_ENGINE=
SQL_DATABASE=
SQL_USER=
SQL_PASSWORD=
SQL_HOST=
SQL_PORT=5432

# Docker settings
PORT=80

# DB settings
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

---

## First-Time Production Deployment

### 1. Generate initial SSL certificate

Port `80` must be available for Certbot's standalone HTTP challenge.

```bash
docker run -it --rm -p 80:80 --name certbot \
-v "/etc/letsencrypt:/etc/letsencrypt" \
-v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
certbot/certbot certonly --standalone \
-d <your-domain>
```

### 2. Start the application stack

```bash
docker compose up -d
```

---

## SSL Certificate Renewal

Because Nginx occupies port `80`, the Docker stack must be stopped before renewing the certificate.

### 1. Stop running containers

```bash
docker compose stop
```

### 2. Renew certificate

```bash
docker run -it --rm -p 80:80 --name certbot \
-v "/etc/letsencrypt:/etc/letsencrypt" \
-v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
certbot/certbot certonly --standalone \
-d <your-domain> \
--force-renewal
```

### 2. Start the application stack again

```bash
docker compose up -d
```

---

## HTTPS Flow

Incoming traffic is handled as follows:

- HTTP traffic arrives at Nginx on port 80
- Nginx redirects all traffic to HTTPS
- HTTPS traffic terminates at Nginx using mounted Let's Encrypt certificates
- Nginx proxies application requests to Gunicorn
- Static assets are served directly by Nginx

This keeps SSL handling and public traffic separate from the Django container itself.

---

## Content Management

All editable site content is managed through Django Admin, including:

- About page content
- Social media links
- Portfolio projects
- Blog posts

This removes the need for manual template editing when publishing new content.

---

## Future Improvements

- Introduce environment-driven domain and SSL configuration
- Automate SSL certificate renewal with cron
- Replace remaining manual deployment steps with a fully repeatable deployment workflow
- Replace Django Templates with a separated React + Vite frontend
- Add development and production Docker Compose profiles

---
