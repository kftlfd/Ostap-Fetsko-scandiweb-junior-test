### Ostap Fetsko ・ o.fetsko@gmail.com

# Junior Developer Test Task

Web-app with product-list page and product-add page.

**Backend**: PHP v7.2, MySQL v5.7

**Frontend**: ReactJS v18.2 (Node v16.18)

# Docker Setup

## Development

Install dependencies:

```shell
$ chmod +x backend/composer.sh frontend/yarn.sh # make files executable
$ backend/composer.sh install                   # install PHP dependencies
$ frontend/yarn.sh install                      # install Node dependencies

### to add new dependencies:
$ backend/composer.sh require [...]
$ frontend/yarn.sh add [...]
```

Start Docker containers:

```shell
$ docker compose \
    -f docker-compose.yml \
    -f docker-compose.react.yml \
    -f docker-compose.adminer.yml \
    up --build
```

- MySQL dev-database
- Apache/PHP backend: http://localhost/api/
- React DevServer: http://localhost:5173
- Adminer (database management): http://localhost:8080

### Backend only (MySQL, Apache/PHP)

```shell
$ docker compose up -d
```

### Frontend only

```shell
$ docker compose -f docker-compose.react.yml up

### or
$ frontend/yarn.sh dev --host

### or run natively (Node.js required)
$ cd frontend
frontend$ yarn install
frontend$ yarn dev
```

## Production build

Run a production build on http://localhost:

```shell
$ docker compose -f docker-compose.prod.yml up -d --build
```

Create a distributable build of an app (backend + frontend) at `dist/`:

```shell
$ docker compose -f docker-compose.build.yml up -d --build

### delete with
$ sudo rm -r dist
```

## Notes

- Backend is tailored to schema of `backend/config/schema.sql`.

- Configure database credentials in `backend/config/db.env`.

Bash scripts-shortcuts:

- ```bash
  ### _dev.sh

  #!/bin/bash
  docker compose \
      -f docker-compose.yml \
      -f docker-compose.react.yml \
      $@

  ### Usage: ./_dev.sh up -d
  ```

- ```bash
  ### _build.sh

  #!/bin/bash
  docker compose \
      -f docker-compose.build.yml \
      up -d --build \
  && \
  sudo chown -R $(whoami) dist

  ### Usage: ./_build.sh
  ```
