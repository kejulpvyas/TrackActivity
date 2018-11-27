import React, {
  Component
} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Login from './app/components/Login/Login';
import SignUp from './app/components/SignUp/SignUp';
import WelcomeScreen from './app/components/WelcomeScreen/WelcomeScreen';
import Activity from './app/components/Activity/Activity';
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import firebase from 'firebase';
const appNavigator = createStackNavigator({

  Login: {
    screen: Login,
  },
  SignUp: {
    screen: SignUp,
  },
  WelcomeScreen: {
    screen: WelcomeScreen,
  },
  Activity: {
    screen: Activity,
  }
}, {
  initialRouteName: 'Login',
});



const appContainer = createAppContainer(appNavigator);

// Now AppContainer is the main component for React to render

export default appContainer;


const firebaseConfig = {
  apiKey: "AIzaSyBSUZEL1H-aIg5GYcvMEUMrTayOPKn2qko",
  authDomain: "react-firebase-9fb44.firebaseapp.com",
  databaseURL: "https://react-firebase-9fb44.firebaseio.com",
  projectId: "react-firebase-9fb44",
  storageBucket: "",
};

firebase.initializeApp(firebaseConfig);