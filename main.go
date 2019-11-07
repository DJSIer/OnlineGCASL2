package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/DJSIer/GCASL2/lexer"
	"github.com/DJSIer/GCASL2/parser"
	"github.com/gin-gonic/gin"
)

const version = "0.1.21"

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}
	router := gin.Default()
	router.LoadHTMLGlob("WOCASL2/*.html")
	
	router.Static("./assets","WOCASL2/assets")
	router.Static("./src","WOCASL2/src")


	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "GCASL Online",
		})
	})
	router.POST("/GCASL", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		postCode := c.PostForm("code")
		lex := lexer.New(postCode)
		p := parser.New(lex)
		code, err := p.ParseProgram()
		if err != nil {
			var buf bytes.Buffer
			b, _ := json.Marshal(p.Errors())
			buf.Write(b)
			c.JSON(200, gin.H{
				"result": "NG",
				"error":  buf.String(),
			})
		} else {
			code, err = p.LiteralToMemory(code)
			code, err = p.LabelToAddress(code)
			if err != nil {
				var buf bytes.Buffer
				b, _ := json.Marshal(p.Errors())
				buf.Write(b)
				c.JSON(200, gin.H{
					"result": "NG",
					"error":  buf.String(),
				})
			} else {
				var buf bytes.Buffer
				b, _ := json.Marshal(code)
				buf.Write(b)
				c.JSON(200, gin.H{
					"result":  "OK",
					"code":    buf.String(),
					"warning": "",
				})
			}
		}
	})
	router.Run(":" + port)
}
