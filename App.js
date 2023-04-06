import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'



const tab=createBottomTabNavigator();

function HomeScreen(){
  return (
    <View style={styles.container}>
      <Text>Page d'accueil</Text>
     
    </View>
  );
}

function ParamScreen(){
  return (
    <View style={styles.container}>
      <Text>Page des paramètre</Text>
     
    </View>
  );
}

function DashboardScreen(){
  return (
    <View style={styles.container}>
      <Text>Page du Dashboard</Text>
     
    </View>
  );
}


export default function App() {

  return(
<NavigationContainer>
  <tab.Navigator 

    
    screenOptions={
      ({route})=> ({
            tabBarIcon:({focused,color,size})=>{
              let iconName;

              if(route.name == "Home"){
                iconName = "home-outline"
              } else if(route.name == "Parameter") {
                iconName = "settings-outline"
              }else if(route.name == "Dashboard"){
                iconName = "planet-outline"
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

    <tab.Screen name ='Home' component={HomeScreen} options=
                                  {{headerStyle: {
                                    backgroundColor: '#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                    fontSize:26
                                  },}}/>

    <tab.Screen name ='Parameter' component={ParamScreen} options=
                                  {{headerStyle: {
                                    backgroundColor:'#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                  },}}/>

    <tab.Screen name ='Dashboard' component={DashboardScreen}options=
                                  {{headerStyle: {
                                    backgroundColor: '#345de7',
                                  },
                                  headerTintColor: '#fff',
                                  headerTitleStyle: {
                                    fontWeight: 'bold',
                                  },}}/>
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
});
