FROM golang:1.21-alpine as build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY src src
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \ 
    CGO_ENABLED=0 GOOS=linux \
    go build -o run src/cmd/app.go

FROM scratch
WORKDIR /app
COPY static static
COPY db.schema.sql .
COPY --from=build /app/run run
EXPOSE 8000
ENV GIN_MODE=release
CMD [ "/app/run" ]