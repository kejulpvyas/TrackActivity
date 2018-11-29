import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View,ScrollView, Picker, Button,TouchableHighlight,Dimensions,TouchableOpacity,Platform } from 'react-native';
import firebase from 'firebase';
//import { Container, Content, Header, Form, Input, Item, Label } from 'native-base';
import formatTime from 'minutes-seconds-milliseconds';
import MapView, { Marker, AnimatedRegion, Polyline } from "react-native-maps";
import haversine from "haversine";
import { ViewPagerAndroid } from 'react-native-gesture-handler';

const LATITUDE = 29.95539;
const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

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
trackSelectionValue: '',
activityName1: '',
activityName2: '',
latitude: LATITUDE,
longitude: LONGITUDE,
routeCoordinates: [],
distanceTravelled: 0,
prevLatLng: {},
coordinate: new AnimatedRegion({
latitude: LATITUDE,
longitude: LONGITUDE
})

};
this.onStartPress = this.onStartPress.bind(this);
this.onLapPress = this.onLapPress.bind(this);
}

componentDidMount() {
const { coordinate } = this.state;
this.watchID = navigator.geolocation.watchPosition(
position => {
const { coordinate, routeCoordinates, distanceTravelled } = this.state;
const { latitude, longitude } = position.coords;

const newCoordinate = {
latitude,
longitude
};

if (Platform.OS === "android") {
if (this.marker) {
this.marker._component.animateMarkerToCoordinate(
newCoordinate,
500
);
}
} else {
coordinate.timing(newCoordinate).start();
}

this.setState({
latitude,
longitude,
routeCoordinates: routeCoordinates.concat([newCoordinate]),
distanceTravelled:
distanceTravelled + this.calcDistance(newCoordinate),
prevLatLng: newCoordinate
});
},
error => console.log(error),
{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
);
}

componentWillUnmount() {
navigator.geolocation.clearWatch(this.watchID);
}
componentWillMount() {
navigator.geolocation.getCurrentPosition(
position => { },
error => alert(error.message),
{
enableHighAccuracy: true,
timeout: 20000,
maximumAge: 1000
}
);
const { navigation } = this.props;
this.setState({
trackSelectionValue: navigation.getParam('trackSelection'),
timerRunning: false
})
this.onStartPress();
this.setState({
activityName1: 'Stop Activity'
})
}

calcDistance = newLatLng => {
const { prevLatLng } = this.state;
return haversine(prevLatLng, newLatLng) || 0;
};

getMapRegion = () => ({
latitude: this.state.latitude,
longitude: this.state.longitude,
latitudeDelta: LATITUDE_DELTA,
longitudeDelta: LONGITUDE_DELTA
});
onStartPress() {
if(this.state.activityName1 == "Done Activity"){
return;
}
// check if clock is running, then stop
if (this.state.timerRunning) {
clearInterval(this.interval);
this.setState({
timerRunning: false,
activityName1: 'Done Activity',
activityName2: 'Reset Activity'
});
return;
}
this.setState({
startTime: new Date(),
activityName1: 'Stop Activity',
activityName2: ''
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
if(this.state.activityName2 == "Cancel Activity"){
this.props.navigation.goBack();
return;
}
if (!this.state.timerRunning) {
this.setState({
timeElasped: new Date(),
activityName1: 'Start Activity',
activityName2: 'Cancel Activity'
});
return;
}
const lap = this.state.timeElasped;
this.setState({
startTime: new Date(),
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
<MapView
style={styles.map}
showUserLocation
followUserLocation
loadingEnabled
region={this.getMapRegion()}
>
<Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
<Marker.Animated
ref={marker => {
this.marker = marker;
}}
coordinate={this.state.coordinate} />
</MapView>
<View style={styles.buttonContainer}>
<TouchableOpacity style={[styles.bubble, styles.btn]}>
<Text style={styles.bottomBarContent}>
{parseFloat(this.state.distanceTravelled).toFixed(2)} miles
</Text>
</TouchableOpacity>
</View>
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
...StyleSheet.absoluteFillObject,
justifyContent: "flex-end",
alignItems: "center"
},
map: {
...StyleSheet.absoluteFillObject
},
bubble: {
flex: 1,
backgroundColor: "rgba(255,255,255,0.7)",
paddingHorizontal: 18,
paddingVertical: 12,
borderRadius: 20
},
latlng: {
width: 200,
alignItems: "stretch"
},
btn: {
width: 80,
paddingHorizontal: 12,
alignItems: "center",
marginHorizontal: 10
},
buttonContainer: {
flexDirection: "row",
marginVertical: 20,
backgroundColor: "transparent"
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



