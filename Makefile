COMPOSE ?= docker compose

.PHONY: help
help:
	@echo "Development:"
	@echo "  make dev-up             Start the local development stack"
	@echo "  make dev-down           Stop the local development stack and remove orphans"
	@echo "  make redeploy-clean     Remove stale frontend container and stop profile services"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy             Rebuild/start production stack, migrate, collect static"
	@echo "  make prod-up            Rebuild and start production stack"
	@echo "  make prod-down          Stop production stack"
	@echo "  make migrate            Run Django migrations in the backend container"
	@echo "  make collectstatic      Collect Django static files in the backend container"
	@echo ""
	@echo "Checks:"
	@echo "  make test               Run backend and frontend tests"
	@echo "  make backend-test       Run backend tests in the backend container"
	@echo "  make frontend-test      Run frontend tests locally"
	@echo "  make frontend-lint      Run frontend lint locally"
	@echo "  make frontend-build     Build frontend locally"

.PHONY: dev-up
dev-up:
	$(COMPOSE) --profile dev up --build

.PHONY: dev-down
dev-down:
	$(COMPOSE) --profile dev down --remove-orphans

.PHONY: redeploy-clean
redeploy-clean:
	$(COMPOSE) rm -sf frontend
	$(COMPOSE) --profile dev --profile certbot down --remove-orphans

.PHONY: prod-up
prod-up:
	$(COMPOSE) up --build -d

.PHONY: prod-down
prod-down:
	$(COMPOSE) down

.PHONY: deploy
deploy: prod-up migrate collectstatic

.PHONY: migrate
migrate:
	$(COMPOSE) exec backend python manage.py migrate

.PHONY: collectstatic
collectstatic:
	$(COMPOSE) exec backend python manage.py collectstatic --noinput

.PHONY: backend-test
backend-test:
	$(COMPOSE) exec \
			-e SQL_ENGINE=django.db.backends.sqlite3 \
			-e SQL_DATABASE=:memory: \
			backend python manage.py test

.PHONY: frontend-test
frontend-test:
	npm --prefix frontend test

.PHONY: frontend-lint
frontend-lint:
	npm --prefix frontend run lint

.PHONY: frontend-build
frontend-build:
	npm --prefix frontend run build

.PHONY: test
test: backend-test frontend-test
