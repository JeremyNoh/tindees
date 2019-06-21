console.disableYellowBox = true;

import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  createBottomTabNavigator
} from "react-navigation";

import React from "react";
import { FontAwesome } from "react-native-vector-icons";

// Screens Import

import Home from "./src/screens/Home";
import Auth from "./src/screens/Auth";
import SplashScreen from "./src/screens/SplashScreen";
import Profil from "./src/screens/Profil";

const SignedOut = createStackNavigator({
  Auth: Auth
});

const SignedIn = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" size={30} color={tintColor} />
        )
      }
    },
    Profil: {
      screen: Profil,
      navigationOptions: {
        tabBarLabel: "Profil",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={30} color={tintColor} />
        )
      }
    }
  },
  {
    initialRouteName: "Home",
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: "#487eb0",
      inactiveTintColor: "grey",
      showLabel: true,
      style: {
        borderTopWidth: 0,
        paddingTop: 3,
        paddingBottom: 4,
        height: 60,
        shadowColor: "black",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        backgroundColor: "black",
        shadowOffset: { width: 0, height: 0 }
      }
    }
  }
);

const AuthLoading = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen
  }
});

export default createAppContainer(
  createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      },
      AuthLoading
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
