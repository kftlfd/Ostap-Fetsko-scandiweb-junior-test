# Junior Developer Test Task

Web-app with product-list page and product-add page.

**Backend**: PHP v7.2, MySQL v5.7

**Frontend**: ReactJS v18.2 (Node v16.18)

# Docker Setup

## Development

Install dependencies:

```
$ chmod +x composer.sh yarn.sh  # make files executable
$ ./composer.sh install         # install PHP dependencies
$ ./yarn.sh install             # install Node dependencies

# to add new dependencies:
$ ./composer.sh require [...]
$ ./yarn.sh add [...]
```

Start Docker containers:

```
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

```
$ docker compose up -d
```

### Frontend only

```
$ docker compose -f docker-compose.react.yml up

# or
$ ./yarn.sh dev --host

# or run natively (Node.js required)
$ cd frontend
frontend$ yarn install
frontend$ yarn dev
```

## Production build

Run a production build on http://localhost:

```
$ docker compose -f docker-compose.prod.yml up -d -- build
```

Create a distributable build of an app (backend + frontend) at `dist/`:

```
$ docker compose -f docker-compose.build.yml up -d --build

# delete with
$ sudo rm -r dist
```

## Notes

- Configure database credentials in `backend/config/db.env`

- Backend is tailored to schema of `backend/config/schema.sql`
