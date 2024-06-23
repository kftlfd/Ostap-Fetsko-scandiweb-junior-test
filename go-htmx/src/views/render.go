package views

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/gin-gonic/gin"
)

func Render(c *gin.Context, status int, template templ.Component) {
	c.Status(status)
	if err := template.Render(c.Request.Context(), c.Writer); err != nil {
		c.String(http.StatusInternalServerError, "%v", err)
	}
}
