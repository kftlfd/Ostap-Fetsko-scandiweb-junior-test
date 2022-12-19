# Products Database

https://elaborate-buys.000webhostapp.com/

**Backend**: PHP v7.2, MySQL v5.7

**Frontend**: ReactJS v18.2 (Node v16.18)

# Docker Setup

## Development

### Install dependencies:

```shell
$ chmod +x backend/composer.sh frontend/yarn.sh # make files executable
$ backend/composer.sh install                   # install PHP dependencies
$ frontend/yarn.sh install                      # install Node dependencies

### to add new dependencies:
$ backend/composer.sh require [...]
$ frontend/yarn.sh add [...]
```

### Start Docker containers:

```shell
### Start containers
$ docker compose [--profile (all | adminer | react)] up [-d] [--build]
```

- MySQL database
- Apache/PHP backend: http://localhost/api/
- React DevServer: http://localhost:5173
- Adminer (database management): http://localhost:8080

```shell
### Stop and remove containers
$ docker compose [--profile ...] down
```

### Backend only (MySQL, Apache/PHP)

```shell
$ docker compose up [-d]

### with Adminer
$ docker compose --profile adminer up [-d]
```

### Frontend only

```shell
$ docker compose run [--rm] --service-ports [-d] react

### or
$ frontend/yarn.sh dev --host

### or run natively (Node.js required)
$ cd frontend
frontend$ yarn dev
```

## Production build

### Run a production build on http://localhost:

```shell
$ docker compose -f docker-compose.prod.yml up [-d] [--build]
```

### Create a distributable build (backend + frontend) at `dist/`:

```shell
$ docker compose --profile dist build && \
  docker compose run --rm dist && \
  docker compose down

### delete build with
$ sudo rm -r dist
```

## Notes

- Backend is tailored to schema of `backend/config/schema.sql`.

- Configure database credentials in `backend/config/db.env`.
