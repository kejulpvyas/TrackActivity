import React, { Component } from 'react';
import firebase from 'firebase';
import { AppRegistry, View, Text,FlatList, ListView, StyleSheet, TouchableHighlight,TouchableOpacity } from 'react-native';
//import { Container, Content, Form, Item,Button,Image,List,ListItem } from 'native-base';
import { List, ListItem, SearchBar } from "react-native-elements";
//import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class ListDetails extends Component {
    static navigationOptions = {
        title: 'Activity Record Details Screen'
        //headerLeft: null
        }
    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            DataSource: ds,
        }
       // this.gotData = this.gotData.bind(this)
    }
     componentWillMount() {
         let ListData=[]
        const {navigation} = this.props;
         ListData = navigation.getParam('data');
        this.setState({
            DataSource:this.state.DataSource.cloneWithRows(ListData)
        })
      //  this.fetchUsers(uid);
    } 
    
   
    renderRow(user, sectionId, rowId) {
        return (
            <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <ListItem
            title={`${rowId}`}
            rightTitle={`${user}`}
           hideChevron
          />
           </List>
        )
    }

    render() {
        return (
           <ListView enableEmptySections dataSource={this.state.DataSource} renderRow={this.renderRow.bind(this)}></ListView>
        )
        }
}

AppRegistry.registerComponent("ListDetails", () => ListDetails);


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