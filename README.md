# Portfolio Platform

A Dockerized portfolio application with a React + Vite frontend and a Django REST Framework backend.

The current MVP is focused on a professional developer portfolio:

- React renders the public portfolio, project detail, about, home, and status pages.
- Django Admin manages editable content and uploaded project media.
- Django REST Framework exposes the API consumed by the frontend.
- Nginx serves the production React build, proxies backend requests, and serves Django static files plus uploaded media.

The backend still contains the blog domain and API, but the public React blog surface is intentionally excluded from the MVP.

---

## Why This Exists

This project is a practical full-stack deployment exercise and a maintainable personal portfolio.

It solves two main problems:

- Portfolio content can be managed through Django Admin instead of source edits.
- The stack can be deployed as a self-hosted Docker Compose application with database persistence, reverse proxying, static file serving, uploaded media serving, and HTTPS support.

---

## Tech Stack

- Python
- Django
- Django REST Framework
- React
- Vite
- Vitest
- ESLint
- PostgreSQL
- Docker Compose
- Gunicorn
- Nginx
- Certbot
- Linux

---

## Core Features

- API-driven React portfolio frontend
- Dynamic home hero content from Django models
- Dynamic about page content from Django models
- Portfolio overview with featured and other project sections
- Full featured-project and project listing routes
- Project detail pages backed by API data
- Project thumbnails and uploaded media support
- Django Admin content management
- Custom React 404 and 500 pages
- PostgreSQL-backed production persistence
- Nginx React build serving, reverse proxying, static file serving, and uploaded media serving
- HTTPS termination using Let's Encrypt certificates
- Frontend and backend test coverage

---

## Application Structure

```text
backend/   Django project, DRF APIs, admin, models, migrations, backend tests
frontend/  React + Vite app, frontend API clients, components, pages, tests
nginx/     Nginx container and reverse proxy configuration
```

The Django apps are split by content domain:

- `core` manages shared site content such as hero, about, and social media context.
- `portfolio` manages portfolio context, projects, thumbnails, and project API responses.
- `blog` remains in the backend for blog content and API support, but is not part of the MVP frontend.
- `users` contains custom user management.

---

## Development

The Docker Compose configuration includes a `frontend` service for local Vite development and a `backend` service for Django/Gunicorn.
The Vite service is attached to the `dev` profile so it does not run in the default production stack.

Vite proxies frontend API and media requests to the backend service:

- `/api/*` -> `backend:8000`
- `/media/*` -> `backend:8000`

Useful local checks:

```bash
docker compose --profile dev up --build
```

```bash
cd frontend
npm test
npm run lint
npm run build
```

```bash
cd backend
pipenv run python manage.py test
```

---

## Production Architecture

The production-facing stack is composed of:

### `backend`

Runs the Django application through Gunicorn and exposes port `8000` internally to the Docker network.

### `db`

Runs PostgreSQL as the persistent database.

### `nginx`

Acts as:

- Production file server for the React build
- Reverse proxy to the backend service for API and admin routes
- Static file server for Django collected static files
- Media file server for uploaded project files
- HTTP to HTTPS redirect layer
- SSL termination point

### `certbot`

Used for Let's Encrypt certificate generation and renewal through the `certbot` Compose profile.

Docker volumes are used for:

- PostgreSQL data persistence
- Django static file persistence
- Uploaded media persistence
- Frontend `node_modules` isolation for local development
- SSL certificate persistence through host-mounted Let's Encrypt paths

---

## Environment Configuration

The repository includes `.env.example` as the tracked documentation template for production and Docker Compose settings.
Copy it to `.env`, then replace every `<...>` placeholder with the deployment value:

```bash
cp .env.example .env
```

`DOMAIN` is used by both Certbot and the Nginx container; Nginx renders it into `server_name` and the Let's Encrypt certificate paths at container startup.

---

## Deployment Notes

After pulling a new `main` version in production, rebuild the Docker images, restart the stack, run migrations, and collect Django static files:

```bash
git checkout main
git fetch origin
git pull --ff-only origin main

docker compose down
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

The default Compose stack builds the React app into the Nginx image and starts `db`, `backend`, and `nginx`. It does not start the local Vite development service or the one-off `certbot` service.

### 1. Generate the initial SSL certificate

Port `80` must be available for Certbot's standalone HTTP challenge.
Load the `.env` values into the shell before running the one-off certificate command:

```bash
set -a
. ./.env
set +a

docker run -it --rm -p 80:80 --name certbot \
-v "/etc/letsencrypt:/etc/letsencrypt" \
-v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
certbot/certbot certonly --standalone \
-d "${DOMAIN}" \
--email "${EMAIL}" \
--agree-tos \
--no-eff-email
```

### 2. Start the application stack

```bash
docker compose up -d
```

### 3. Run backend migrations and collect static files

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

---

## SSL Certificate Renewal

Because Nginx occupies port `80`, the Docker stack must be stopped before standalone renewal.

### 1. Stop running containers

```bash
docker compose stop
```

### 2. Renew certificate

```bash
set -a
. ./.env
set +a

docker run -it --rm -p 80:80 --name certbot \
-v "/etc/letsencrypt:/etc/letsencrypt" \
-v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
certbot/certbot certonly --standalone \
-d "${DOMAIN}" \
--email "${EMAIL}" \
--agree-tos \
--no-eff-email \
--force-renewal
```

### 3. Start the application stack again

```bash
docker compose up -d
```

---

## HTTPS, Static, and Media Flow

Incoming traffic is handled as follows:

- HTTP traffic arrives at Nginx on port `80`.
- Nginx redirects configured domain traffic to HTTPS.
- HTTPS traffic terminates at Nginx using mounted Let's Encrypt certificates.
- Nginx renders `DOMAIN` from `.env` into its runtime configuration before startup.
- `/api/` and `/admin/` requests are proxied to Gunicorn.
- React application routes are served from the built frontend files in the Nginx image.
- Django static assets are served by Nginx from `/static/`.
- Uploaded media files are served by Nginx from `/media/`.

This keeps SSL handling and public file serving outside the Django container.

---

## Content Management

Editable site content is managed through Django Admin, including:

- Home hero content
- About page content
- Social media links
- Portfolio context text
- Portfolio projects
- Project thumbnails and thumbnail captions
- Blog posts in the backend, outside the MVP frontend

---

## Future Improvements

- Automate SSL certificate renewal.
- Replace remaining manual deployment steps with a fully repeatable deployment workflow.
