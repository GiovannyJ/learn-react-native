package main

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	// "github.com/gin-contrib/cors"
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

var weather_vals = []WeatherData{
		{ID: 1, Temp: 100, Humid: 40, Percip: 20, Date: "02/22/23"},
		{ID: 2, Temp: 54, Humid: 66, Percip: 0, Date: "02/23/23"},
	}
/*
GET
general get method send data from server side to client side
@return: data from table and 200 status code
*/
func getData(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	//data to return from the api call
	

	d := JSONdata{Data: weather_vals}

	c.IndentedJSON(http.StatusOK, d)
}

func insertData(c *gin.Context){
	c.Header("Access-Control-Allow-Origin", "*")
	
	var newWeather WeatherData
	
    if err := c.BindJSON(&newWeather); err != nil {
		return
    }
	
    weather_vals = append(weather_vals, newWeather)
	
	d := JSONdata{Data: weather_vals}

	c.IndentedJSON(http.StatusCreated, d)
}

func getDataByID(id int, c *gin.Context){
	c.Header("Access-Control-Allow-Origin", "*")

	data, err := getdataid(id)
	if err != nil{
		c.IndentedJSON(http.StatusNotFound, gin.H{"message":"Data not found"})
		return
	}

	c.IndentedJSON(http.StatusOK, data)
}


func getdataid(id int) (JSONdata, error){
	for _, i := range(weather_vals){
		if i.ID == id{
			return JSONdata{Data: i}, nil
		}
	}
	return JSONdata{}, fmt.Errorf("Not Found")
}


func updateData(id int, c *gin.Context){
	c.Header("Access-Control-Allow-Origin", "*")
	var data WeatherData
	if err := c.BindJSON(&data); err != nil{
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error":"invalid request"})
		return
	}
	for i, d := range weather_vals{
		if d.ID == id{
			weather_vals[i] = data
			weatherData := JSONdata{Data: weather_vals}
			c.IndentedJSON(http.StatusOK, weatherData)
			return
		}
	}

	c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "data not found"})

}


//router driver make all get and post requests here
func main() {
	router := gin.Default()

	//*GET METHOD- data from database
	router.GET("/data", func(c *gin.Context) {
		id := c.Query("id")
		switch{
			case len(id) > 0:
				idINT, err := strconv.Atoi(id)
				if err != nil{
					return
				}
				getDataByID(idINT, c)
			default:
				getData(c) 
		}
	})

	//*POST METHOD - data insert database
	router.POST("/data", insertData)

	//*PATCH METHOD - data update database
	router.PATCH("/data", func(c *gin.Context){
		id := c.Query("id")
		switch{
		case len(id) > 0:
			idINT, err := strconv.Atoi(id)
			if err != nil{
				return
			}
			updateData(idINT, c)
		}
	})

	// config := cors.DefaultConfig()
	// config.AllowOrigins = []string{"*"}

	// router.Use(cors.New(config))

	//*activate the server running on port 8080
	router.Run("localhost:8080")
}
