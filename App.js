//dependecy imports
import React, {useEffect, useState} from 'react';
import {StyleSheet, ActivityIndicator, FlatList, View, Button, SafeAreaView, Text, Alert} from 'react-native';


//CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
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

//Main APP that renders when the code is called
const App = () => {
  //set the loading screen -> initially true (isloading) bc the data isnt here yet
  const [isLoading, setLoading] = useState(true);

  //set the data and set data states 
  const [data, setData] = useState([]);

  //API func asyn since the page loads before the data comes in
  const getWeather = async () => {
    //try to get the data from the location
    try {
      //get = get data POST = send data (post needs a body attr)
      const options = {
        method:'GET',
        header: {
            'Content-Type': 'application/jsons',
        },
      }
      //get the data from the API end point and use the options we set earlier
      const response = await fetch('http://localhost:8080/data', options);
      //json data that we get from the API call
      const json = await response.json();
      //set the data to the json body tag of "data" (DECIDED IN THE API CREATION STAGE)
      setData(json.data);
      //if theres an error say the error
    } catch (error) {
      console.error(error);
    //when everything is done make sure that loading is done too
    } finally {
      setLoading(false);
    }
  };
  //call the API function
  // useEffect(() => {
  //   getWeather();
  // }, []);

  //return the rendered state of the page
  return (
    //view style template
      //if the data is loading = true then show loading bar
    <SafeAreaView sytle={styles.container}>
    <View >
    
      {isLoading ? (
        <Button
        title="Load API"
        onPress={() => getWeather()}
        />
      ) : (
        //if not render a list
        <FlatList
          //extract and render from the API call
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            //display the text
            <Text sytle={styles.title}>
              {item.date}
              Temperature:{item.temp}
              Humidity:{item.humid}
              Percipitaion:{item.percip}
            </Text>
            )}
        />
        )}
          <Separator />
          <Button 
          title="Reset"
          onPress={() => setLoading(true) & Alert.alert("Reset")}
          />
    
      </View>
    </SafeAreaView>
  );
};

//run the app
export default App;