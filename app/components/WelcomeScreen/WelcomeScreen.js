import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Picker, Button } from 'react-native';
import firebase from 'firebase';
import { Container, Content, Header, Form, Input, Item, Label } from 'native-base';
import { withNavigation } from 'react-navigation';
class WelcomeScreen extends Component {

    static navigationOptions = {
        title: 'Welcome Screen',
        headerLeft: null
    }

    constructor(props) {
        super(props);
        this.state = ({
            UID: '',
            FName: '',
            LName: '',
            Email: '',
            UserName:'',
            trackSelection:''
        })
    }
    async componentWillMount() {
        const {
            navigation
        } = this.props;
        var uid = navigation.getParam('UserId');

        const snapshot = await firebase.database().ref('/UserDetails/' + uid).once('value');
        var FName = (snapshot.val() && snapshot.val().FName);
        var LName = (snapshot.val() && snapshot.val().LName);
        this.setState({
            UserName: (FName + ' ' + LName)
        })
    } 
    
    render(){
        return(  
           
            <Container>
                <Form>
                    <Item>
                        <View><Text>Welcome {this.state.UserName}</Text></View>
                    </Item>
                </Form>
                
                <View style={styles.container}>
                    <Text>What you want to track ? {this.state.trackSelection}</Text>
                    <Button 
                    title="Start Activity"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                    onPress={() => {
                        alert("Your activity has been start for track !");
            this.props.navigation.navigate('Activity', {
                trackSelection: this.state.trackSelection
            });
          }}
                />
                <Picker
                    selectedValue={this.state.trackSelection}
                    style={{backgroundColor:"#fafafa",position:"absolute",bottom:0,left:0,right:0 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({trackSelection: itemValue})}>
                    <Picker.Item label="--SELECT--" value="null" />
                    <Picker.Item label="Running" value="runningValue" />
                    <Picker.Item label="Walking" value="walkingValue" />
                    <Picker.Item label="Driving" value="drivingValue" />
                </Picker>
  
                </View>
            </Container>  
        );
    }
}

//AppRegistry.registerComponent("WelcomeScreen",() => WelcomeScreen);

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  export default withNavigation(WelcomeScreen);


