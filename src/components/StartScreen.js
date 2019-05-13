import React from 'react';
import { View,Text,TouchableOpacity,StyleSheet } from 'react-native';

import socket from '../socketio/socket';

export default class StartScreen extends React.Component{
    componentDidMount(){
    }
    render(){
        return(
            <View style={Styles.container}>
            <Text>Touch Duel</Text>
            <TouchableOpacity
            style={Styles.startButton}
            onPress={()=>
                this.props.navigation.navigate("Lobby")
            }
            >
                <Text style={Styles.start}>Start</Text>
            </TouchableOpacity>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    startButton:{
        height: 60,
        width: '70%',
        borderWidth:1,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        borderColor:'grey'
    },
    start:{
        fontSize:20,
        color:'grey'
    }
})