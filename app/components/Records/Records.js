import React, { Component } from 'react';
import firebase from 'firebase';
import { AppRegistry, View, Text, ListView, StyleSheet, TouchableHighlight } from 'react-native';
import { Container, Content, Form, Item } from 'native-base';
//import { createStackNavigator, StackActions, NavigationActions } from 'react-navigation';

export default class Records extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            UID:''
        }
    }
     componentWillMount() {
        const {navigation} = this.props;
        var uid = navigation.getParam('UID');
        this.setState({
            UID:uid
        })
    } 
  
    recordDetails = (value) => {
        const {navigate} = this.props.navigation;
        navigate('RecordDetails', {
            UID: this.state.UID,
            recordStatus: value
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                        <TouchableHighlight onPress={() => this.recordDetails('Running')}>
                        <View style={styles.rowText}>
                            <Text style={styles.row}>Running</Text>
                        </View>
                        </TouchableHighlight>
                        </Item>
                        <Item>
                        <TouchableHighlight onPress={() => this.recordDetails('Walking')}>
                        <View style={styles.rowText}>
                            <Text style={styles.row}>Walking</Text>
                        </View>
                        </TouchableHighlight>
                           
                        </Item>
                        <Item>
                        <TouchableHighlight onPress={() => this.recordDetails('Driving')}>
                        <View style={styles.rowText}>
                            <Text style={styles.row}>Driving</Text>
                        </View>
                        </TouchableHighlight>
                            
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

AppRegistry.registerComponent("Records", () => Records);


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