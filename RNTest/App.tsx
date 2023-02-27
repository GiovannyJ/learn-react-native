import React, {useEffect, useState} from "react";
import {StyleSheet, ActivityIndicator, FlatList, View, Button, SafeAreaView, Text, Alert} from 'react-native';
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
  });

const Separator = () => <View style={styles.separator} />


//the function to run at the start of our app
const App = () => {
    
    //getting variables for api
    const[isLoading, setLoading] = useState(true);
    //bind them to be weather list
    const[data, setData] = useState<Weather[]>([]);

    //calling api
    const getWeather = async () =>{
      const options = {
        method:'GET',
        header: {
            'Content-Type': 'application/jsons',
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
            <><FlatList
                  data={data}
                  keyExtractor={(item) => item.date}
                  renderItem={({ item }) => (
                    <View>
                      <Text style={styles.title}>Date: {item.date}</Text>
                      <Text style={styles.fixToText}>Temperature: {item.temp}</Text>
                      <Text>Humidity: {item.humid}</Text>
                      <Text>Precipitation: {item.percip}</Text>
                    </View>
                  )} />
                  <View style={styles.center}>
                    <Button
                      title="Reset"
                      onPress={() => setLoading(true)} />
                  </View></>
          )}
        </View>
        </SafeAreaView>
      );
    };
    
    export default App;