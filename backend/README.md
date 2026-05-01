# Portfolio Web App

A database driven portfolio web app using Django.

## Development setup

1. Set up environmental variables for development:

```bash
echo 'SECRET_KEY="<a_secret>"' >> .env
echo 'DEBUG=True' >> .env
echo 'DOMAIN_NAME="domain-name"' >> .env
echo 'SITE_OWNER="owner"' >> .env
```

2. Install dependencies using pipenv:

```bash
pipenv install && pipenv shell
```

Pipenv reads in the environmental variables from `.env` that was created in step 1.
These environmental variables are needed to run the development server.
