package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

//data class for weather obj (structured off database columns)
type WeatherData struct {
	ID	   int	  `json:"id"`
	Temp   int    `json:"temp"`
	Humid  int    `json:"humid"`
	Percip int    `json:"percip"`
	Date   string `json:"date"`
}

type JSONdata struct{
	Data interface{} `json:"data"`
}

/*
GET
general get method send data from server side to client side
@return: data from table and 200 status code
*/
func getData(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	//data to return from the api call
	weather_vals := []WeatherData{
		{ID: 1, Temp: 100, Humid: 40, Percip: 20, Date: "02/22/23"},
		{ID: 2, Temp: 54, Humid: 66, Percip: 0, Date: "02/23/23"},
	}

	d := JSONdata{Data: weather_vals}

	c.IndentedJSON(http.StatusOK, d)
}

//router driver make all get and post requests here
func main() {
	router := gin.Default()

	//*GET METHOD- data from database
	router.GET("/data", getData)

	//*activate the server running on port 8080
	router.Run("localhost:8080")
}
