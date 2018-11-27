import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label,Icon,Left } from 'native-base';

export default class SignOut extends Component{
    static navigationOptions = {
        drawerLabel: 'SignOut',
      };
    
      render() {
        return (
            <Button
           onPress={() => this.props.navigation.navigate('WelcomeScreen')}
            title="Go back home"
          />
        );
      }
    }

AppRegistry.registerComponent("SignOut", () => SignOut);
const styles = StyleSheet.create({
    icon: {
      width: 24,
      height: 24,
    },
  });