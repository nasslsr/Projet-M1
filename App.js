import React, { useEffect, useState }  from 'react';
import { StyleSheet, Text, View,Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MapView , {Marker} from 'react-native-maps';





const tab=createBottomTabNavigator();


function MapScreen(){
  const FirstView = {
    latitude: 48.814443,
    longitude: 2.395022,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        FirstView={FirstView}
      >
        <Marker
          coordinate={{ latitude: 48.814443, longitude: 2.395022 }}
          title="Ivry sur Seine"
          description="ESME SUDRIA"
        />
      </MapView>
    </View>
  );
}

function ParamScreen(){
  return (
    <View style={styles.container}>
      <Text>Page des paramètres</Text>
     
    </View>
  );
}

function DashboardScreen(){
  return (
    <View style={styles.container}>
      <Text>Page du Dashboard</Text>
      <Ionicons name="search-sharp" size={60} />
    </View>
  );
}

function SplashScreen() {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('./assets/esme.png')}
        style={styles.splashImage}
      />
      <Text style={styles.splashText}
          > Bienvenue sur l'appli Velib de l'ESME</Text>
    </View>
  );
}

export default function App() {
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
<NavigationContainer>
  <tab.Navigator 

    
    screenOptions={
      ({route})=> ({
            tabBarIcon:({focused,color,size})=>{
              let iconName;

              if(route.name == "Map"){
                iconName = "map-outline"
                iconHead="search-sharp"
              } else if(route.name == "Parameter") {
                iconName = "settings-outline"
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
                                    backgroundColor: '#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  },
                                  headerRight: () => <Ionicons name="search-sharp" size={35} color="black" style={{ marginRight: 20 }} /> ,
                                  headerLeft: () => <Ionicons name="person-circle-sharp" size={35} color="black" style={{ marginLeft: 20 }} />
                                  }}/>



    <tab.Screen name ='Parameter' component={ParamScreen} options=
                                  {{headerStyle: {
                                    backgroundColor:'#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                  },
                                  headerRight: () => <Ionicons name="search-sharp" size={35} color="black" style={{ marginRight: 20 }} /> ,
                                  headerLeft: () => <Ionicons name="person-circle-sharp" size={35} color="black" style={{ marginLeft: 20 }} />
                                }}
                                  />

    <tab.Screen name ='Dashboard' component={DashboardScreen}options=
                                  {{headerStyle: {
                                    backgroundColor: '#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                  },
                                  headerRight: () => <Ionicons name="search-sharp" size={35} color="black" style={{ marginRight: 20 }} /> ,
                                  headerLeft: () => <Ionicons name="person-circle-sharp" size={35} color="black" style={{ marginLeft: 20 }} />
                                  }} />

                                  

  </tab.Navigator>
</NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c4b4d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: 2000,
    height:2000,
  },
});
