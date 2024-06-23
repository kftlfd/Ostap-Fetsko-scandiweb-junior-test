package routing

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"productsdb/src/models"
	"productsdb/src/views"
	"productsdb/src/views/components"
	"productsdb/src/views/pages"
)

func ProductsRouter(g *gin.Engine, pathPrefix string) *gin.RouterGroup {
	r := g.Group(pathPrefix)

	r.GET("/", getProductsPage)
	r.GET("/add", getAddProductPage)
	r.POST("/add", postProductForm)
	r.POST("/delete", postDeleteProductsForm)
	r.GET("/templates/form", getProductFormComponent)

	return r
}

func getProductsPage(ctx *gin.Context) {
	products, err := models.DB.GetAll()
	if err != nil {
		ctx.String(http.StatusInternalServerError, "%v", err)
		return
	}
	views.Render(ctx, http.StatusOK, pages.Show(products))
}

func getAddProductPage(ctx *gin.Context) {
	views.Render(ctx, http.StatusOK, pages.Add())
}

func postProductForm(ctx *gin.Context) {
	pType := ctx.PostForm("type")
	sku := ctx.PostForm("sku")
	name := ctx.PostForm("name")
	price, err := strconv.ParseFloat(ctx.PostForm("price"), 64)

	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing price", "err": err.Error()})
		return
	}

	product := models.Product{
		Sku:   sku,
		Name:  name,
		Price: price,
		Type:  pType,
	}

	switch pType {
	case "book":
		weight, err := strconv.ParseFloat(ctx.PostForm("weight"), 64)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing weight", "err": err.Error()})
			return
		}

		p := models.ProductBook{
			Product: product,
			Weight:  weight,
		}

		err = models.DB.Insert(&p)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx.Header("HX-Redirect", "/")
		ctx.Redirect(http.StatusCreated, "/")

	case "dvd":
		size, err := strconv.ParseFloat(ctx.PostForm("size"), 64)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing size", "err": err.Error()})
			return
		}

		p := models.ProductDVD{
			Product: product,
			Size:    size,
		}

		err = models.DB.Insert(&p)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx.Header("HX-Redirect", "/")
		ctx.Redirect(http.StatusCreated, "/")

	case "furniture":
		width, err := strconv.ParseFloat(ctx.PostForm("width"), 64)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing width", "err": err.Error()})
			return
		}

		length, err := strconv.ParseFloat(ctx.PostForm("length"), 64)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing length", "err": err.Error()})
			return
		}

		height, err := strconv.ParseFloat(ctx.PostForm("height"), 64)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error parsing height", "err": err.Error()})
			return
		}

		p := models.ProductFurniture{
			Product: product,
			Width:   width,
			Length:  length,
			Height:  height,
		}

		err = models.DB.Insert(&p)
		if err != nil {
			ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		ctx.Header("HX-Redirect", "/")
		ctx.Redirect(http.StatusCreated, "/")

	default:
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"err": "type not recognized"})
	}
}

func postDeleteProductsForm(ctx *gin.Context) {
	idsRaw := ctx.PostFormArray("product-id")

	ids := make([]int, 0)

	for _, idStr := range idsRaw {
		id, err := strconv.Atoi(idStr)
		if err == nil {
			ids = append(ids, id)
		}
	}

	err := models.DB.Delete(ids)
	if err != nil {
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	products, err := models.DB.GetAll()
	if err != nil {
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	views.Render(ctx, http.StatusOK, components.Products(products))
}

func getProductFormComponent(ctx *gin.Context) {
	pType := ctx.Query("type")

	switch pType {
	case "book":
		views.Render(ctx, http.StatusOK, components.FormBook())
	case "dvd":
		views.Render(ctx, http.StatusOK, components.FormDVD())
	case "furniture":
		views.Render(ctx, http.StatusOK, components.FormFurniture())
	default:
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "type not recognized"})
	}
}
