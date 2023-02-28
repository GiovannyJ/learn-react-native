import React, {useEffect, useState} from "react";
import {StyleSheet, ActivityIndicator,TextInput, FlatList, View, Button, SafeAreaView, Text, Alert} from 'react-native';
//struct modeled off our data
type Weather = {
    id: number;
    temp: number;
    humid: number;
    percip: number;
    date: string;
}

const styles = StyleSheet.create({
    center: {
        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    title: {
      textAlign: 'center',
      marginVertical: 8,
      fontSize: 20,
      marginTop:10,
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });

const Separator = () => <View style={styles.separator} />


//the function to run at the start of our app
const App = () => {
    
    //getting variables for api
    const[isLoading, setLoading] = useState(true);
    //bind them to be weather list
    const[data, setData] = useState<Weather[]>([]);
    
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [precipitation, setPrecipitation] = useState('');
    const [date, setDate] = useState('');
    const [id] = useState('0');

    //calling api
    const getWeather = async () =>{
      const options = {
        method:'GET',
        header: {
            'Content-Type': 'application/json',
        },
      }  
      try{
            const response = await fetch('http://localhost:8080/data', options);
            const json = await response.json();
            setData(json.data);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    const postWeather = async () =>{
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({
            id:parseInt(id), 
            temp:parseInt(temperature),
            humid:parseInt(humidity),
            percip:parseInt(precipitation),
            date:date
          }),
      };
          try{
            const response = await fetch('http://localhost:8080/data',options);
            const json = await response.json();
            setData(json.data)
          }catch(error){
            console.error(error);
          }finally{
            setLoading(false);
          }
    };

    const updateWeather = async () =>{
      const options ={
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:parseInt(id),
          temp:parseInt(temperature),
          humid:parseInt(humidity),
          percip:parseInt(precipitation),
          date:date
        }),
        };
        try{
          const response = await fetch('http://localhost:8080/data?id='+'',options)
          const json = await response.json();
          setData(json.data)
        }catch(error){
          console.error(error);
        }finally{
          setLoading(false)
        }

    };

    //call api function
    // useEffect(() => {
    //     getWeather();
    //   }, []);
    
      return (
        <SafeAreaView style={styles.center}>
        <View style={styles.center}>
          {isLoading ? (
            <Button title="Load API" onPress={() => getWeather()}/>
          ) : (
            <><><FlatList
                  data={data}
                  keyExtractor={(item) => item.date}
                  renderItem={({ item }) => (
                    <View>
                      <Text style={styles.title}>Date: {item.date}</Text>
                      <Text style={styles.fixToText}>Temperature: {item.temp}</Text>
                      <Text>Humidity: {item.humid}</Text>
                      <Text>Precipitation: {item.percip}</Text>
                      <Button
                        title="Update"
                        onPress={() => updateWeather()} />
                    </View>
                  )} />
                  <View style={styles.center}>
                    <Button
                      title="Reset"
                      onPress={() => setLoading(true)} />
                  </View></>
                  
                  <View style={styles.center}>
                  <Text>Temperature</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Temperature"
                    keyboardType="numeric"
                    onChangeText={setTemperature}
                    value={temperature}
                  />
                  <Text>Humidity</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Humidity"
                    keyboardType="numeric"
                    onChangeText={setHumidity}
                    value={humidity}
                  />
                  <Text>Precipitation</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Precipitation"
                    keyboardType="numeric"
                    onChangeText={setPrecipitation}
                    value={precipitation}
                  />
                  <Text>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Date"
                    keyboardType="numeric"
                    onChangeText={setDate}
                    value={date}
                  />
                    <Button
                      title="Upload"
                      onPress={() => postWeather()} />
                  </View></>
          )}
          
        </View>
        </SafeAreaView>
      );
    };
    
    export default App;