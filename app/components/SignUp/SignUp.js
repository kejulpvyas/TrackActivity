import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
//import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class SignUp extends Component {
constructor(props){
    super(props);
    this.state=({
      FName:'',
      LName:'',
      Email:'',
      Password:''
    })
  }
  
  onSubmit(FName,LName,Email,Password)
  {
  try
  {
    const {navigate} = this.props.navigation;
    if(this.state.Password.length < 6)
    {
      alert("please enter at least six characters !");
      return;
    }
    var key = '';
  firebase.auth().createUserWithEmailAndPassword(Email,Password)
  .then(function(user) { 
    key = user.user.uid;
    firebase.database().ref('/UserDetails').child(key).set({
    FName: FName,
    LName: LName,
    Email: Email,
    Password: Password
  }).then(function () {
      navigate("WelcomeScreen", {
        UserId: key
      });

}).catch(function(error) {
alert("Please enter correct data");

});
  })
  .catch(function(error) { console.log(error) });
  // var key = firebase.database().ref('/UserDetails').push().key
  
  }
  catch(error)
  {
    console.log(error.toString());
  
  }
  }
  
  componentDidMount(){
  
    firebase.auth().onAuthStateChanged((user) =>{
      if(user!=null){
        console.log(user);
      }
    })
    
  }
  
    render() {
      return (
        <Container style={styles.container}>
          <Form>
            <Item floatingLabel>
              <Label>First Name :</Label>
              <Input autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(FName) => this.setState({FName})} />
            </Item>
            <Item floatingLabel>
              <Label>Last Name :</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none" 
                  onChangeText={(LName) => this.setState({LName})}
                />
            </Item>
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
              primary
              onPress={() => this.onSubmit(this.state.FName,this.state.LName,this.state.Email,this.state.Password)}>
              <Text style={{color:'white'}}>Submit</Text>
            </Button>
            <Button style={{ marginTop: 10 }}
              full
              rounded
              primary
              onPress={() => this.props.navigation.goBack()}>
              <Text style={{color:'white'}}>Go Back</Text>
            </Button>
  
          </Form>
        </Container>
      );
    }
}
AppRegistry.registerComponent("SignUp", () => SignUp);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding:10,
      backgroundColor: '#fff',
    }
   
  });
