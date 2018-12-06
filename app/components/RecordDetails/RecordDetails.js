import React, { Component } from 'react';
import firebase from 'firebase';
import { AppRegistry, View, Text,FlatList, ListView, StyleSheet, TouchableHighlight,TouchableOpacity } from 'react-native';
//import { Container, Content, Form, Item,Button,Image,List,ListItem } from 'native-base';
import { List, ListItem, SearchBar } from "react-native-elements";
//import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class RecordDetails extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            userDataSource: [],
            UID:'',
            recordStatus:''
        }
        this.gotData = this.gotData.bind(this)
    }
     componentWillMount() {
        const {navigation} = this.props;
        var uid = navigation.getParam('UID');
        var recordStatus=navigation.getParam('recordStatus');
        this.setState({
            UID:uid,
            recordStatus:recordStatus
        })
      //  this.fetchUsers(uid);
    } 
    
    componentDidMount() {
        
        this.fetchUsers(this.state.UID,this.state.recordStatus);
    }

    fetchUsers(uid,recordStatus) {
        
        var searchers = firebase.database().ref("ActivityRecords").orderByChild("UserId").equalTo(uid);
        searchers.on('value',this.gotData,this.errData)
    }
    gotData = (data) => {
        let items = [];
        let newList = [];
        var distanceValue = data.val();
        var keys = Object.keys(distanceValue);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            items.push({
                TotalDistance: distanceValue[k].TotalDistance.toFixed(2),
                Activity:distanceValue[k].Activity,
                StartDateTime:distanceValue[k].StartDateTime,
                EndDateTime:distanceValue[k].EndDateTime,
                AvgSpeed:distanceValue[k].AvgSpeed,
                UserId:distanceValue[k].UserId
            })
        }
         newList = items.filter(data => data.Activity == this.state.recordStatus);

        this.setState({
           // userDataSource: this.state.userDataSource.cloneWithRows(newList)
           userDataSource:[...this.state.userDataSource, ...newList]
        })

    }
    errData = (error) => {
        alert(error);
    }
   
    // renderRow(user, sectionId, rowId) {
    //     return (
    //         <TouchableHighlight>
    //         <View style={styles.rowText}>
    //             <Text style={styles.row}>{parseFloat(user.TotalDistance).toFixed(2)} miles
    //             {user.StartDateTime}
    //             {user.EndDateTime}</Text>
    //         </View>
    //     </TouchableHighlight>

    //     )
    // }
    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "86%",
              backgroundColor: "#CED0CE",
              marginLeft: "14%"
            }}
          />
        );
      };
    render() {
        return (
           // <ListView enableEmptySections dataSource={this.state.userDataSource} renderRow={this.renderRow.bind(this)}></ListView>
           <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
        data={this.state.userDataSource}
        renderItem={({ item }) => (
          <ListItem
            roundAvatar
            title={`${item.TotalDistance} miles`}

            containerStyle={{ borderBottomWidth: 0 }}
            onPress={() => {
            this.props.navigation.navigate('ListDetails', {
                data:item
            });
          }}
          />
        )}
        keyExtractor={item => item.UserId}
        ItemSeparatorComponent={this.renderSeparator}

      />
    </List>
        );
    }
}

AppRegistry.registerComponent("RecordDetails", () => RecordDetails);


const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        padding: 10,
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
        marginBottom: 3
    },
    rowText: {
        flex: 1
    }
});