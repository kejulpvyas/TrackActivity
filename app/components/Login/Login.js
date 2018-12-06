import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
//import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

import firebase from 'firebase';

import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';

export default class Login extends Component {
constructor(props){
    super(props);
    this.state = ({
      Email: '',
      Password:''
  })
  }  

  onLogin() {
    const {navigate} = this.props.navigation;
 
    try {
      firebase.auth().signInWithEmailAndPassword(this.state.Email, this.state.Password).then(function (response) {
        if (response) {
          var userId = response.user.uid;
         // firebase.database().ref('/UserDetails/' + userId).once('value').then(function (snapshot) {
          //  var username = (snapshot.val() && snapshot.val().FName) || 'Anonymous';
          navigate("WelcomeScreen", {
              UserId: userId
            });
      
        }

      }).catch(function (error) {
        alert("Please enter correct data");

      });
    }
 
    catch (error) {
      console.log(error.toString());
     
    }
  }
  
  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log(user);
      }
    })

  }
  
  // async loginWithFacebook(){
  //   const {type,token} = await Facebook.logInWithReadPermissionAsync('313991015997517',{permissions:['public_profile']})
  // if(type == 'success'){
  //   const credential=firebase.auth.FacebookAuthProvider.credential(token)
  //   firebase.auth().signInWithCredential(credential).catch((error) =>
  //   {console.log(error.toString())})
  // }
  // }

  
  
    render() {
      return (
       
        <Container style={styles.container}>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(Email) => this.setState({Email})} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                  onChangeText={(Password) => this.setState({Password})}
                />
            </Item>
            <Button style={{ marginTop: 10 }}
              full
              rounded
              success
              onPress={() => this.onLogin()}>
              <Text style={{color:'white'}}>Login</Text>
            </Button>
            <Button style={{ marginTop: 10 }}
              full
              rounded
              primary
              onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={{color:'white'}}> Sign up
              </Text>
            </Button>
        
          </Form>
          </Content>
        </Container>
      );
    }
}
AppRegistry.registerComponent("Login", () => Login);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding:10,
      backgroundColor: '#fff',
    }
   
  });
