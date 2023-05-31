import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View,Image, Animated, Easing, TextInput, Button, TouchableOpacity, ImageBackground, FlatList , Dimensions} from 'react-native';
import { NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView , {Marker, Polyline, Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { ScrollView } from 'react-native-gesture-handler';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { WebView } from 'react-native-webview';
import CumulioDashboardComponent, { CumulioDashboard } from '@cumul.io/react-native-cumulio-dashboard';





const tab=createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const GOOGLE_MAPS_APIKEY = 'METTRE_VOTRE_CLÉ';
const VELIB_URL_INFORMATION = 'https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json';
const VELIB_URL_STATUS = 'https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_status.json';



function MapScreen({route}) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#B6e2f1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: 2000,
      height:2000,
    },
    calloutContainer: {
      width: 149,
      height:100, 
      paddingTop:5
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      width: 70
    },
    button: {
      backgroundColor: '#2196F3',
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 15, 
      marginRight: 7,
      marginLeft: -2,
      paddingRight:5,
      paddingLeft:5,
      minWidth: 75,
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 11.5,
    },
  
  
  });
  
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const navigation = useNavigation();

  

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      console.log(location);
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    if (route.params && route.params.station) {
      setSelectedStation(route.params.station);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      {isReady && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {selectedStation && (
            <Marker
            coordinate={{
              latitude: selectedStation.lat,
              longitude: selectedStation.lon,
            }}
            title={selectedStation.name}
            description={`Capacity: ${selectedStation.capacity}`}
            onPress={() => setSelectedStation(selectedStation)}
          >
            <Image
                source={require('./assets/icon-borne.png')}
                style={{ width: 50, height: 50 }}
            />
            <Callout>
              <View style={styles.calloutContainer}>
                <Text>{selectedStation.name}</Text>
                <Text>Station Code: {selectedStation.stationCode}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Itinéraire')}>
                    <Text style={styles.buttonText}>Itinéraire</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => console.log('Button 2 pressed')}>
                    <Text style={styles.buttonText}>Plus d'infos</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
          
          )}
          {latitude && longitude && (
            <Marker
              coordinate={{ latitude: latitude, longitude: longitude }}
              title="Vous êtes ici "
              
              
            >
                <Image style={{width:100, height:100, resizeMode:'contain'}} 
                        source={require('./assets/me.png')} />
            </Marker>
          )}
        </MapView>
      )}
    </View>
  );
}


function VelibDashboard(){
  const ref = useRef<CumulioDashboard>(null);
  return (
    <WebView
      style={styles.container}
      source={{ uri: 'https://app.cumul.io/dashboard/4c99e5ca-4c5c-454e-ac54-0997696203d8' }}
    />
  );
}

function ItineraryScreen() {
  
 
 
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [stations, setStations] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  const [originNearestStation, setOriginNearestStation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);


  
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(VELIB_URL_INFORMATION)
      .then(response => response.json())
      .then(data => {
        setStations(data.data.stations);
      });
  }, []);

  useEffect(() => {
    if (!origin || !destination) return;

    mapRef.current.fitToSuppliedMarkers(["origin","destination"], {
      edgepadding: {top:50, right:50, bottom:50, left:50},
    });
  }, [origin,destination]);

  const fetchAndSortStations = (userLat, userLon, filterType) => {
    return Promise.all([
      fetch(VELIB_URL_INFORMATION).then(response => response.json()),
      fetch(VELIB_URL_STATUS).then(response => response.json()),
    ])
      .then(([infoData, statusData]) => {
        const combinedData = infoData.data.stations.map(station => {
          const status = statusData.data.stations.find(s => s.station_id === station.station_id);
          return {...station, ...status};
        });
        
        let sortedAndFilteredData;
        
        if (filterType === "origin") {
          sortedAndFilteredData = combinedData
            .filter(station => station.num_bikes_available > 0)
            .sort((a, b) => {
              const distA = getDistanceFromLatLonInKm(userLat, userLon, a.lat, a.lon);
              const distB = getDistanceFromLatLonInKm(userLat, userLon, b.lat, b.lon);
              return distA - distB;
            });
        } else if (filterType === "destination") {
          sortedAndFilteredData = combinedData
            .filter(station => station.num_docks_available > 0)
            .sort((a, b) => {
              const distA = getDistanceFromLatLonInKm(userLat, userLon, a.lat, a.lon);
              const distB = getDistanceFromLatLonInKm(userLat, userLon, b.lat, b.lon);
              return distA - distB;
            });
        }
  
        return sortedAndFilteredData;
      })
      .catch(err => console.error(err));
  };
  

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  }


  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('./assets/icon-position.png')}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
         <GooglePlacesAutocomplete
            placeholder='Votre position'
            placeholderTextColor='black'
            fetchDetails={true}
            value='6 rue Molière. Ivry sur Seine, France'
            onFail={error => console.log(error)}
            onNotFound={() => console.log('no results')}
            textInputProps={{
              autoFocus: true,
              blurOnSubmit: false,
              placeholderTextColor:'black'
            }}
            onPress={(data, details = null) => {
              if (details && details.geometry && details.geometry.location) {
                console.log('Selected location details:', details);
                setOrigin({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
          
                fetchAndSortStations(details.geometry.location.lat, details.geometry.location.lng, "origin")
                  .then(sortedStations => {
                    if (sortedStations && sortedStations.length > 0) {
                      setOriginNearestStation({
                        latitude: sortedStations[0].lat,
                        longitude: sortedStations[0].lon,
                        name_origin: sortedStations[0].name,
                        num_bikes_origin:sortedStations[0].num_bikes_available
                      });
                    }
                  });
              }
            }}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'fr',
              
            }}
            styles={{
              textInput: {
                borderBottomWidth: 1,
                borderColor: '#ccc',
                flex: 1,
                color: 'black'
              }
            }}
          />
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('./assets/icon-walking.png')}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
          <GooglePlacesAutocomplete
            placeholder='Arrivée'
            fetchDetails={true}
            onFail={error => console.log(error)}
            onNotFound={() => console.log('no results')}
            textInputProps={{
              autoFocus: true,
              blurOnSubmit: false,
              placeholderTextColor:'black'
            }}
            onPress={(data, details = null) => {
              if (details && details.geometry && details.geometry.location) {
                console.log('Selected location details:', details);
                setDestination({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });

                fetchAndSortStations(details.geometry.location.lat, details.geometry.location.lng, "destination")
              .then(sortedStations => {
                // vérifiez que les stations sont bien triées et prenez la première (la plus proche)
                if (sortedStations && sortedStations.length > 0) {
                  setNearestStation({
                    latitude: sortedStations[0].lat,
                    longitude: sortedStations[0].lon,
                    name_destination: sortedStations[0].name,
                    num_bikes_destination:sortedStations[0].num_bikes_available
                  
                  });
                }
              });
              }
            }}
           
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'fr',
              
            }}
            styles={{
              textInput: {
                borderBottomWidth: 1,
                borderColor: '#ccc',
                flex: 1,
                color: 'black'
              }
            }}
          />
        </View>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:-20 ,marginTop:-20 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:0  }}>
      <Image
        source={require('./assets/distance.png')}
        style={{ width: 25, height: 25, marginRight: 10 }} 
      />
      <Text style={{ fontSize: 15 }}>Distance : {distance} km</Text> 
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center',marginLeft:15 }}>
      <Image
        source={require('./assets/icon-bike.png')}
        style={{ width: 25, height: 25, marginRight: 10 }} 
      />
      <Text style={{ fontSize: 15 }}>Durée : {duration}</Text> 
    </View>
  </View>
</View>


      </View>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.856614,
          longitude: 2.3522219, 
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
          {origin && <Marker identifier="origin" coordinate={origin}> 
          <Image style={{width:100, height:100, resizeMode:'contain'}} source={require('./assets/mee.png')} />
          </Marker>}
         {destination && <Marker identifier="destination" coordinate={destination}> 
          <Image style={{width:50, height:50, resizeMode:'contain'}} source={require('./assets/destination.png')} />
          </Marker>}
          {nearestStation && <Marker identifier="nearestStation" coordinate={nearestStation}> 
          <Image style={{width:60, height:60, resizeMode:'contain'}} source={require('./assets/borne_velib_waypoints.png')} />
          <Callout>
              <View style={styles.calloutContainer}>
                <Text style={{ fontSize: 8 }}>{nearestStation.name_destination}</Text>
                <Text style={{ fontSize: 8 }}>Bornes disponibles: {nearestStation.num_bikes_destination}</Text>
              </View>
            </Callout>
          </Marker>}
          {originNearestStation && <Marker identifier="originNearestStation" coordinate={originNearestStation}> 
          <Image style={{width:60, height:60, resizeMode:'contain'}} source={require('./assets/borne_velib_waypoints.png')} />
          <Callout >
              <View style={styles.calloutContainer}>
                <Text style={{ fontSize: 8 }}>{originNearestStation.name_origin}</Text>
                <Text style={{ fontSize: 8 }}>Vélibs disponibles: {originNearestStation.num_bikes_origin}</Text>
              </View>
            </Callout>
          </Marker>}
          {origin && destination && originNearestStation &&  nearestStation &&(
            <MapViewDirections
              origin={origin}
              waypoints={[originNearestStation, nearestStation]}
              destination={destination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="yellow"
              mode='BICYCLING'
              onError={(errorMessage) => { console.log('MapViewDirections error:', errorMessage); }}
              onReady={result => {
                setDistance(result.distance);
              
                const hours = Math.floor(result.duration / 60);  // Convert minutes into hours
                const minutes = Math.floor(result.duration % 60);            
              
                setDuration(`${hours}h ${minutes}min`);  
            
              }}
              
              
              
            />
          )}
</MapView>
    </View>
  );
}

function InformationScreen(){
  return (
    <View style={styles.container}>
      <Chatbot/>
     
    </View>
  );

}

function Chatbot() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState('');

  const styles = StyleSheet.create({
    glass: {
      width: 500,
      height: 400,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent:'center',
      padding: 50,
      color: '#000',
      borderRadius: 9,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
      borderRightWidth: 2,
      borderRightColor: 'transparent',
      borderLeftWidth: 2,
      borderLeftColor: 'transparent',
      borderTopWidth: 2,
      borderTopColor: 'transparent',
      shadowColor: 'rgba(45, 55, 68, 0.3)',
      shadowOffset: {
        width: 10,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: 10,
      lineHeight: 1.5,
      transform: [{ translateY: -5 }],
      transition: { transform: [{ translateY: -5 }], duration: 500 },
      justifyContent: 'center', 
      alignItems: 'center', 
      marginBottom:60
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      marginTop: 30,
      textAlign: 'center',
      marginBottom:20,
    },
    input: {
      width: '100%',
      height: 30,
      borderWidth: 0,
      paddingLeft: 130,
      paddingTop: 5,
      fontSize: 24,
      borderRadius: 20,
      backgroundColor: 'white',
      
      color:'black'
    },
    chatLog: {
      fontSize: 24,
      marginTop: 30,
    },
  });
  

  function talk() {
    const know = {
      "j'aimerais m'abonner à velib": "Heureux d'apprendre cette nouvelle ! clicker sur ce lien pour commencer votre inscription : https://www.velib-metropole.fr",
      "j'aimerais signaler un problème": "Nous sommes là pour vous aider. Dites moi tout ! ",
      "bonjour": "Bonjour! Que puis-je faire pour vous aider !",
      "comment mettre fin à mon abonnement velib": "C'est une bien triste nouvelle que vous m'annoncez, je vais vous aider à commencer la démarche.",
      "merci": "je vous en prie !"
     
    };
    const user = userInput;
    if (user in know) {
      setChatLog(prevLog => prevLog + user + "\n" + know[user] + "\n");
    } else {
      setChatLog(prevLog => prevLog + user + "\n" + "Sorry, I didn't understand\n");
    }
  }

  return (
  
      <View style={styles.container}>
        
         <View style={styles.glass}>
           <Image source={require('./assets/chatbot.png')} style={{width:150, height:150,marginBottom:20}}/>
           <Text style={styles.title}>Votre assitant Velib</Text>
           <Text style={styles.subtitle}>Quelle est votre question ?</Text>
           <View style={styles.input}>
              <TextInput
              type="text"
              id="userBox"
              placeholder="Poser votre question"
              placeholderTextColor="black"
              onChangeText={(text) => setUserInput(text)}
              onSubmitEditing={talk}
              value={userInput}
             />
            </View>
            <Text style={styles.chatLog}>{chatLog}</Text>
          </View>
  
      </View>
  
  );
  
}

function SplashScreen() {
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(new Animated.Value(100)).current;
  useEffect(() => {
    Animated.timing(backgroundFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: -250,
        duration: 2000,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start();
    }, 2250);
  }, []);

  const styles = StyleSheet.create({
    splashContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#91b1fd',
      opacity: backgroundFade,
    },
    splashImage: {
      width: 200,
      height: 200,
    },
    splashText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      opacity: logoFade,
      transform: [{translateY: Animated.subtract(logoMovement, 100)}],
    },
  });

  return (
    <Animated.View style={styles.splashContainer}>
      <LottieView
        style={{ width: 400, height: 400 }}
        source={require('./assets/roll-it-bicycle.json')}
        autoPlay
        loop
      />
      <Animated.Text style={styles.splashText}>
        Bienvenue sur l'application Velib de l'ESME
      </Animated.Text>
    </Animated.View>
  );
}

function UserConnection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
  
  };

  const handleForgotPassword = () => {
    
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#B6e2f1',
      alignItems: 'center',
      justifyContent: 'center',
      width:'100%'
    },
    logo:{
      width:200,
      height:200,
      marginBottom: 50,
    },
    inputView:{
      width:"80%",
      backgroundColor:"#Beebc5",
      borderRadius:25,
      height:50,
      marginBottom:20,
      justifyContent:"center",
      padding:20
    },
    inputText:{
      height:50,
      color:"white"
    },
    forgot:{
      color:"black",
      fontSize:11
    },
    loginBtn:{
      width:"80%",
      backgroundColor:"#F3212f",
      fontWeight:'bold',
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      marginBottom:10
    },
    loginText:{
      color:"white"
    }
  });

  return (
    <View style={styles.container}>
      <Image source={require('./assets/icon-profile.png')} style={styles.logo} />
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          placeholder="Votre Mail"
          placeholderTextColor="#003f5c"
          color='black'
          onChangeText={text => setEmail(text)}
          value={email}
        />
      </View>
      <View style={styles.inputView} >
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Votre Mot De Passe"
          placeholderTextColor="#003f5c"
          color='black'
          onChangeText={text => setPassword(text)}
          value={password}
        />
      </View>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("Signup")}>
        <Text style={styles.loginText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

function SearchScreen({navigation}) {

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
      backgroundColor: '#fff',
    },
    searchInput: {
      height: 40,
      margin: 12,
      padding: 10,
      borderWidth: 1,
      color: 'red'
    },
    list: {
      marginHorizontal: 12,
    },
    item: {
      padding: 10,
      marginVertical: 4,
      backgroundColor: '#C2DFEA',
      flexDirection: 'row',
      alignItems: 'center',
    },
    stationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      marginRight: 10,
    },
    icon: {
      fontSize: 24,
    },
    title: {
      fontSize: 18,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    capacity: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
    },
    capacityValue: {
      marginLeft: 10,
    },
    stationCode : {
      flexDirection : 'row'
    },
    stationCodeValue:{
      marginLeft: 10,
    },
    bikesAvailable : {
      flexDirection : 'row'
    },

  });
  
  

  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      fetchAndSortStations(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchAndSortStations = (userLat, userLon) => {
    Promise.all([
      fetch(VELIB_URL_INFORMATION).then(response => response.json()),
      fetch(VELIB_URL_STATUS).then(response => response.json())
    ])
    .then(([infoData, statusData]) => {
      const statusById = statusData.data.stations.reduce((acc, station) => {
        acc[station.station_id] = station;
        return acc;
      }, {});
  
      const mergedData = infoData.data.stations.map(station => {
        return {
          ...station,
          num_bikes_available: statusById[station.station_id]?.num_bikes_available || 0
        }
      });
  
      const sortedData = mergedData.sort((a, b) => {
        const distA = getDistanceFromLatLonInKm(userLat, userLon, a.lat, a.lon);
        const distB = getDistanceFromLatLonInKm(userLat, userLon, b.lat, b.lon);
        return distA - distB;
      });
  
      setStations(sortedData);
      setFilteredStations(sortedData);
    })
    .catch(err => console.error(err));
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  }

  const handleSearch = query => {
    const filteredData = stations.filter(station => station.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredStations(filteredData);
    setSearchQuery(query);
  };

  const handleStationPress = (station) => {
    navigation.navigate('Map', {
      latitude: station.lat,
      longitude: station.lon,
      title: station.name,
      station: station,
      selectedStation: station
    });
  };

 
  

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleStationPress(item)}>
        <View style={styles.item}>
          <View style={styles.stationInfo}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.capacity}>
                <Text>Capacité totale de la borne : </Text>
                <View style={styles.capacityValue}>
                  <Text>{item.capacity}</Text>
                </View>
              </View>
              <View style={styles.stationCode}>
                <Text>Le Code de la station : </Text>
                <View style={styles.stationCodeValue}>
                  <Text>{item.stationCode}</Text>
                </View>
              </View>
              <View style={styles.bikesAvailable}>
                <Text>Nombre de Velib disponible : </Text>
                <View style={styles.bikesAvailableValue}>
                  <Text>{item.num_bikes_available}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher votre station Velib"
        value={searchQuery}
        placeholderTextColor='black'
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredStations}
        renderItem={renderItem}
        keyExtractor={item => item.station_id.toString()}
        style={styles.list}
      />
    </View>
  );
}


function Home() {

  const navigation = useNavigation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    
    setTimeout(() => {
      setIsReady(true);
    }, 10000);
  }, []);

  if (!isReady) {
   
    return <SplashScreen />;
  }


  return(

  <tab.Navigator 

    
    screenOptions={
      ({route})=> ({
            tabBarIcon:({focused,color,size})=>{
              let iconName;

              if(route.name == "Map"){
                iconName = "map-outline"
                iconHead="search-sharp"
              } else if(route.name == "Information") {
                iconName = "information-circle-outline"
                iconHead="search-sharp"
              }else if(route.name == "Dashboard"){
                iconName = "planet-outline"
                iconHead="search-sharp"
              }
              return <Ionicons name={iconName} size={25} color='black' />
              

            },
            tabBarLabel: ({ focused, color }) => {
              let labelSize;
  
              switch (route.name) {
                  case 'Map':
                      labelSize = 20;
                      break;
                  case 'Information':
                  case 'Dashboard':
                      labelSize = 18;
                      break;
                  default:
                      labelSize = 16;
                      break;
              }
  
              return (
                  <Text style={{ fontSize: labelSize, color: color, textAlign: 'center', marginBottom: 5 }}>
                      {route.name}
                  </Text>
              );
          },
            tabBarActiveTintColor: 'green',
            tabBarActiveBackgroundColor:'#62c994',
          tabBarInactiveTintColor: 'black',
          tabBarActiveTintColor:"black",
          tabBarStyle:{
            position: 'absolute',
            bottom:25,
            left:20,
            right:20,
            elevation:0,
            backgroundColor:'white',
            borderRadius:15,
            height:90
          },
          tabBarItemStyle:{
            height:90,
            borderRadius:15
          
          }

          
      })}>

    <tab.Screen name ='Map' component={MapScreen} options=
                                  {{headerStyle: {
                                    backgroundColor: '#91b1fd',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  },
                                  headerRight: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                      <Ionicons
                                        name="search-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginRight: 20 }}
                                      />
                                    </TouchableOpacity>) ,
                                  headerLeft: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                      <Ionicons
                                        name="person-circle-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginLeft: 20 }}
                                      />
                                    </TouchableOpacity>
                                 )
                                  }}/>



    <tab.Screen name ='Information' component={InformationScreen} options=
                                  {{headerStyle: {
                                    backgroundColor:'#91b1fd',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  },
                                  headerRight: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                      <Ionicons
                                        name="search-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginRight: 20 }}
                                      />
                                    </TouchableOpacity>) ,
                                  headerLeft: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                      <Ionicons
                                        name="person-circle-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginLeft: 20 }}
                                      />
                                    </TouchableOpacity>)
                                }}
                                  />

    <tab.Screen name ='Dashboard' component={VelibDashboard}options=
                                  {{headerStyle: {
                                    backgroundColor: '#91b1fd',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  },
                                  headerRight: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                      <Ionicons
                                        name="search-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginRight: 20 }}
                                      />
                                    </TouchableOpacity>) ,
                                  headerLeft: () => (
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                      <Ionicons
                                        name="person-circle-sharp"
                                        size={35}
                                        color="black"
                                        style={{ marginLeft: 20 }}
                                      />
                                    </TouchableOpacity>)
                                  }} />
      
      

                                  

  </tab.Navigator>

  );
}


export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
          initialParams={{ navigation }}
        />
        <Stack.Screen name="Profile" component={UserConnection} options={{headerStyle: {
                                    backgroundColor: '#91b1fd',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  }, }}/>
         <Stack.Screen name="Search" component={SearchScreen} options={{headerStyle: {
                                    backgroundColor: '#91b1fd',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  }, }}/>
            <Stack.Screen name="Itinéraire" component={ItineraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B6e2f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: 2000,
    height:2000,
  },
    
  
});


