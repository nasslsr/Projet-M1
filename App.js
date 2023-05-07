import React, { useEffect, useState, useRef }  from 'react';
import { StyleSheet, Text, View,Image, Animated, Easing, TextInput, Button, TouchableOpacity, ImageBackground, FlatList , Dimensions} from 'react-native';
import { NavigationContainer, useNavigation} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView , {Marker, Polyline, Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const tab=createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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
                <Text>Capacity: {selectedStation.capacity}</Text>
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
                <Image style={{width:50, height:50, resizeMode:'contain'}} 
                        source={require('./assets/icon-position.png')} />
            </Marker>
          )}
        </MapView>
      )}
    </View>
  );
}

function ItineraryScreen() {
  

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('./assets/icon-position.png')}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
          <TextInput placeholder="Votre position" placeholderTextColor='black' style={{ borderBottomWidth: 1, borderColor: '#ccc', flex: 1, color:'black' }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={require('./assets/icon-walking.png')}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
          <TextInput placeholder="Arrivée" placeholderTextColor='black' style={{ borderBottomWidth: 1, borderColor: '#ccc', flex: 1, color:'black',placeholderTextColor:'black'}} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center',}}>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Image source={require('./assets/icon-car.png')} style={{ width: 40, height: 40 ,marginHorizontal: 60,marginTop: 5}} />
            <Text>Voiture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Image source={require('./assets/icon-metro.png')} style={{ width: 40, height: 40 , marginHorizontal: 60,marginTop: 5}} />
            <Text>Métro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Image source={require('./assets/icon-walking.png')} style={{ width: 40, height: 40, marginHorizontal: 60, marginTop: 5 }} />
            <Text>Marche</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <Image source={require('./assets/icon-bike.png')} style={{ width: 40, height: 40, marginHorizontal: 60, marginTop: 5}} />
            <Text>Vélo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          
        }}
          
      
      />
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
  const [chatLog, setChatLog] = useState('Answer appearing here');

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
      "Who are you": "Hello, Codewith_random here",
      "How are you": "Good :)",
      "What can i do for you": "Please Give us A Follow & Like.",
      "Your followers": "I have my family of 5000 members, i don't have follower ,have supportive Famiy ",
      "ok": "Thank You So Much",
      "Bye": "Okay! Will meet soon.."
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

function DashboardConnection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Ajouter la logique de connexion ici
  };

  const handleForgotPassword = () => {
    // Ajouter la logique de récupération de mot de passe ici
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
      height:200
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
      <Image source={require('./assets/icon-dashboard.png')} style={styles.logo} />
      <View style={styles.inputView} >
        <TextInput
          style={styles.inputText}
          placeholder="Prenom@velib.fr"
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
          placeholder="Mot de Passe"
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
  
function DashboardScreen(){
  return (
    <View style={styles.container}>
      <DashboardConnection/>
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
      fontSize: 35,
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
    // Ajouter la logique de connexion ici
  };

  const handleForgotPassword = () => {
    // Ajouter la logique de récupération de mot de passe ici
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

const API_URL = 'https://velib-metropole-opendata.smoove.pro/opendata/Velib_Metropole/station_information.json';

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
  });
  
  

  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setStations(data.data.stations);
        setFilteredStations(data.data.stations);
      });
  }, []);

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
                <Text>Capacity:</Text>
                <View style={styles.capacityValue}>
                  <Text>{item.capacity}</Text>
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
    // Simulate loading some data or performing an API call
    setTimeout(() => {
      setIsReady(true);
    }, 10000);
  }, []);

  if (!isReady) {
    // Show splash screen while data is being loaded
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

    <tab.Screen name ='Dashboard' component={DashboardConnection}options=
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

