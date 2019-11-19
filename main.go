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
	"github.com/jinzhu/gorm"
)

const version = "0.1.21"

// ShareCode URL id binding
type ShareCode struct {
	ID string `uri:"id" binding:"required"`
}

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		log.Fatal("$PORT must be set")
	}
	router := gin.Default()
	router.LoadHTMLGlob("WOCASL2/*.html")

	router.Static("./assets", "WOCASL2/assets")
	router.Static("./src", "WOCASL2/src")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "GCASL Online",
		})
	})

	router.GET("/GCASL2/:id", func(c *gin.Context) {
		var share ShareCode
		if err := c.ShouldBindUri(&share); err != nil {
			c.JSON(400, gin.H{"msg": err})
			return
		}
		c.JSON(200, gin.H{"uuid": share.ID})
	})
	//debug : curl -F "code=value1" localhost:8080/GCASL2/add
	router.POST("/GCASL2/add", func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		db, err := gorm.Open("postgres", "host=myhost port=myport user=gorm dbname=gorm password=mypassword")
		if err != nil {
			c.JSON(200, gin.H{
				"error": "DB Error",
			})
			return
		}
		defer db.Close()
		postCode := c.PostForm("code")

		c.JSON(200, postCode)
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
				var buf, warbuf bytes.Buffer
				b, _ := json.Marshal(code)
				buf.Write(b)
				bb, _ := json.Marshal(p.Warnings())
				warbuf.Write(bb)
				c.JSON(200, gin.H{
					"result":  "OK",
					"code":    buf.String(),
					"warning": warbuf,
				})
			}
		}
	})
	router.Run(":" + port)
}
