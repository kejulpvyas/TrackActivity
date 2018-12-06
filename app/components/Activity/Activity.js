import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View,ScrollView, Picker, Button,TouchableHighlight,Dimensions,TouchableOpacity,Platform, AlertIOS} from 'react-native';
import firebase from 'firebase';
//import { Container, Content, Header, Form, Input, Item, Label } from 'native-base';
import formatTime from 'minutes-seconds-milliseconds';
import MapView, { Marker, AnimatedRegion, Polyline } from "react-native-maps";
import haversine from 'haversine';
//import geolib from 'geolib';
import moment from 'moment';
//import Geolocation from 'react-native-geolocation-service';
const LATITUDE = 40.743678;
const LONGITUDE = -74.177988;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
export default class Activity extends Component {

constructor(props) {
        super(props);
        this.state = {
            timeElasped: null,
            timerRunning: false,
            startTime: null,
            UID:'',
            trackSelectionValue: '',
            activityName1: '',
            activityName2: '',
            StartDateTime:'',
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
            })

        };
this.onStartPress = this.onStartPress.bind(this);
this.onLapPress = this.onLapPress.bind(this);

}

componentDidMount() {
    const {
        coordinate
    } = this.state;
    this.watchID = navigator.geolocation.watchPosition(
        position => {
            const {
                coordinate,
                routeCoordinates,
                distanceTravelled
            } = this.state;
            const {
                latitude,
                longitude,
                speed
            } = position.coords;

            const newCoordinate = {
                latitude,
                longitude,
                speed
            };
            if(this.state.activityName1 == "Stop Activity"){
                coordinate.timing(newCoordinate).start();
                this.setState({
                    latitude,
                    longitude,
                    speed : position.coords.speed < 0 ? 0 : Math.round(position.coords.speed),
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled: (distanceTravelled + this.calcDistance(newCoordinate)),
                    prevLatLng: newCoordinate
                });
            }
        },
        error => console.log(error), {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        }
    );
}

componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
}
componentWillMount() {
    navigator.geolocation.getCurrentPosition(
        position => {
        },
        error => alert(error.message), {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        }
    );
    const {
        navigation
    } = this.props;
    this.setState({
        trackSelectionValue: navigation.getParam('trackSelection'),
        UID:navigation.getParam('UID'),
        timerRunning: false
    })
    this.onStartPress();
    this.setState({
        activityName1: 'Stop Activity',
        StartDateTime:moment().format('lll')
    })
}

calcDistance = newLatLng => {
    const {
        prevLatLng
    } = this.state;
    return haversine(prevLatLng, newLatLng,{unit: 'mile'}) || 0;

};
calcAvgSpeed = () => {
    var arr = formatTime(this.state.timeElasped).split(':')
    var TotalTime=parseInt(arr[0]) + (parseInt(arr[1]) / 60) + (parseInt(arr[2]) / 3600)
    return ( 
       ((this.state.distanceTravelled.toFixed(2)) / (TotalTime.toFixed(2))) + ' mph'
    
    )

};
// speedCounter = newLatLng => {
//     const {
//         prevLatLng
//     } = this.state;
   
//    if(prevLatLng.latitude != undefined && prevLatLng.longitude != undefined && prevLatLng.tempTime != undefined)
//    { 
//    return(geolib.getSpeed(
//         {lat: prevLatLng.latitude, lng: prevLatLng.longitude, time: prevLatLng.tempTime},
//         {lat: newLatLng.latitude, lng: newLatLng.longitude, time: newLatLng.tempTime},
//         {unit: 'mph'}
//     ));
//    }

//     }
getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
    speed:this.state.speed
});
onStartPress() {
    const {navigate} = this.props.navigation;
    var userID = this.state.UID;
    if(this.state.activityName1 == "Done Activity"){
        AlertIOS.alert(
        'Do you want to save this?',
        '',
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Yes',
                onPress: () => {
                    var key=firebase.database().ref('/ActivityRecords').push().key
                    firebase.database().ref('/ActivityRecords').child(key).set({
                        UserId:userID,
                        TotalDistance: this.state.distanceTravelled,
                        EndDateTime:moment().format('lll'),
                        StartDateTime:this.state.StartDateTime,
                        Activity:this.state.trackSelectionValue,
                        timeElasped:formatTime(this.state.timeElasped),
                        AvgSpeed:this.calcAvgSpeed()
                    }).then(function (response) {
                        alert("Your Activity has been saved !");
                        navigate("WelcomeScreen", {
                            UserId: userID
                        });

                    }).catch(function (error) {
                        alert(error.toString());

                    });
                },
          },
        ],
      );
      return;
}
// check if clock is running, then stop
   
        if (this.state.timerRunning) {
            clearInterval(this.interval);
            this.setState({
                timerRunning: false,
                activityName1: 'Done Activity',
                activityName2: 'Reset Activity',
            });
            return;
        }
this.setState({
    startTime: new Date(),
    activityName1: 'Stop Activity',
    activityName2: '',
    StartDateTime:moment().format('lll')
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
    if (this.state.activityName2 == "Cancel Activity") {
        this.props.navigation.goBack();
        return;
    }
    if (!this.state.timerRunning) {
        this.setState({
            timeElasped: new Date(),
            activityName1: 'Start Activity',
            activityName2: 'Cancel Activity',
            distanceTravelled: 0,
            speed:0
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
        Total Distance :{parseFloat(this.state.distanceTravelled).toFixed(2)} miles
        </Text>
        </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bubble, styles.btn]}>
        <Text style={styles.bottomBarContent}>
        Current Speed : {(this.state.speed) ? this.state.speed : 0} mph
        </Text>
        </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.bubble, styles.btn]}>
        <Text style={styles.bottomBarContent}>Your Activity : {this.state.trackSelectionValue}</Text>
        </TouchableOpacity>
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

AppRegistry.registerComponent("Activity", () => Activity);
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

