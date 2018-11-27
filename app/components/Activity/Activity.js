import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View,ScrollView, Picker, Button,TouchableHighlight } from 'react-native';
import firebase from 'firebase';
import { Container, Content, Header, Form, Input, Item, Label } from 'native-base';
//import TimerCountdown from 'react-native-timer-countdown';
//import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
import formatTime from 'minutes-seconds-milliseconds';


export default class Activity extends Component {

    static navigationOptions = {
        title: 'Activity Screen',
        headerLeft: null
    }

    constructor(props) {
        super(props);
      
        this.state = {
          timeElasped: null,
          timerRunning: false,
          startTime: null,
          laps: [],
          trackSelectionValue:'',
          activityName1:'',
          activityName2:''
        };
        this.onStartPress = this.onStartPress.bind(this);
        this.onLapPress = this.onLapPress.bind(this);
    }

    async componentWillMount() {
        const {navigation} = this.props;
        this.setState({
            trackSelectionValue:navigation.getParam('trackSelection'),
            timerRunning: false
        })
        this.onStartPress();
        this.setState({
          activityName1:'Stop Activity'
        })
    } 

    onStartPress() {
      // check if clock is running, then stop
      if (this.state.timerRunning) {
        clearInterval(this.interval);
        this.setState({
          timerRunning: false,
          activityName1:'Done Activity',
          activityName2:'Reset Activity'
        });
        return;
      }
  
      this.setState({
        startTime: new Date(),
        activityName1:'Stop Activity',
        activityName2:''
      });
  
      this.interval = setInterval(() => {
        this.setState({
          timeElasped: new Date() - this.state.startTime,
          timerRunning: true,
        });
      }, 30);
    }

    onLapPress() {
      // Reset timer
      if (!this.state.timerRunning) {
        this.setState({
          timeElasped: new Date(),
          laps: [],
          activityName1:'Start Activity',
          activityName2:'Cancel Activity'
        });
        return;
      }
  
      const lap = this.state.timeElasped;
  
      this.setState({
        startTime: new Date(),
        laps: this.state.laps.concat(lap),
        
      });
    }
  
    // create start/stop buttons
    startStopButton() {
      const style = this.state.timerRunning ? styles.stopButton : styles.startButton;
      return (
        <TouchableHighlight
          onPress={this.onStartPress}
          underlayColor="#e6e6fa"
          style={[styles.button, style]}
        >
          <Text>
           {this.state.activityName1}
          </Text>
        </TouchableHighlight>
      );
    }
  
    // create the lap button
    lapButton() {
      return (
        <TouchableHighlight
          onPress={this.onLapPress}
          underlayColor="#e6e6fa"
          style={this.state.activityName2 ? styles.button : null}
        >
          <Text>
            {this.state.activityName2}
          </Text>
        </TouchableHighlight>
      );
    }
    
    render(){
        return( 
         
          <View style={styles.container}>
           <View>
          <Text>Your Activity : {this.state.trackSelectionValue}</Text>
          </View>
        <View style={styles.header}>
          <View style={styles.timerWrapper}>
            <Text style={styles.time}>{formatTime(this.state.timeElasped)}</Text>
          </View>

          <View style={styles.buttonWrapper}>
            {this.startStopButton()}
            {this.lapButton()}
          </View>
        </View>
      </View>
          
        );
    }
}

AppRegistry.registerComponent("Activity",() => Activity);
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
    },
    header: {
      flex: 1,
    },
    footer: {
      flex: 1,
      backgroundColor: '#dcdcdc',
    },
    timerWrapper: {
      flex: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    time: {
      fontSize: 60,
    },
    buttonWrapper: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#dcdcdc',
    },
    button: {
      borderWidth: 2,
      height: 100,
      width: 100,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startButton: {
      borderColor: '#7fffd4',
    },
    stopButton: {
      borderColor: '#dc143c',
    },
    lap: {
      justifyContent: 'space-around',
      flexDirection: 'row',
      borderBottomWidth: 1,
      padding: 10,
      borderColor: '#f0f8ff',
    },
    lapText: {
      fontSize: 20,
    },
  });
  



