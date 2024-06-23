package main

import (
	"github.com/gin-gonic/gin"

	"productsdb/src/models"
	"productsdb/src/routing"
)

func main() {
	models.ConnectDB()

	app := gin.Default()
	app.Static("/static", "./static")

	routing.ProductsRouter(app, "/")

	app.Run(":8080")
}
