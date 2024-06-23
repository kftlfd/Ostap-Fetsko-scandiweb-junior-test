Implementation using Go + HTMX + TailwindCSS


## Requirements

- Go 1.21
- [Go Templ](https://templ.guide/)
- [Go Air](https://github.com/air-verse/air?tab=readme-ov-file#installation) (optional)
- NodeJs


## Setup

```sh
# install Node dependencies
npm install

# use Air to start and automatically re-build the project on file changes
air

# (or do it manually)
npm run tw:build
templ generate
go run src/cmd/app.go
```


## Docker

```sh
docker compose up --build
```
