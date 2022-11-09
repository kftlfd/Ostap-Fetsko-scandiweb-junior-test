# Junior Developer Test Task

Web-app with product-list page and product-add page.

**Backend**: PHP v7.2, MySQL v5.7

**Frontend**: ReactJS v18.2 (Node v16.18)

# Docker Setup

## Development

```
$ docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.react.yml up -d
```

Starts MySQL, Adminer (for database management, at http://localhost:8080), Apache/PHP server with backend API, and React DevServer at http://localhost:5173.

### Backend only (MySQL, Adminer, and Apache/PHP)

```
$ docker compose up -d
```

### Frontend only

```
$ docker compose -f docker-compose.react.yml up -d
```

Or run natively (Node.js required)

```
$ cd frontend
frontend$ yarn install
frontend$ yarn dev
```

## Production

```
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Creates a frontend build and places it alongside php files in Apache server, starts MySQL and Adminer. Runs at http://localhost.

## Notes

- Modify:

  - MySQL root password in `docker-compose.yml`.
  - Database environment variables in `backend/db.env`
  - _Optionally_: default values for connection to database in `backend/dist/lib/DB/Table.php`

- If have modified Dockerfile(s), don't forget to rebuild the images:

  ```
  $ docker compose [...] build
  # or
  $ docker compose [...] up --build
  ```

- Dev and Prod setups use the same Docker Volume for database. To separate them, specify new volume for prod database in `docker-compose.prod.yml`:

  ```
  services:
    ...

    mysql:
      volumes:
        - [prod-db-volume]:/var/lib/mysql

  volumes:
    [prod-db-volume]:
  ```

- Set aliases for docker commands, for example:

  ```
  $ alias dev="docker compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.react.yml"

  $ dev up -d --build
  $ dev down
  ```
