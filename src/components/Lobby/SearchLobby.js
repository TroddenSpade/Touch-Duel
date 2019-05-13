import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';
import socket from '../../socketio/socket';

export default class SearchLobby extends React.Component{
    state={
        lobbies:[],
    }
    componentWillMount(){
        socket.on("lobby",(lobby)=>{
            this.setState(prevState => ({
                lobbies:[...prevState.lobbies,lobby],
            }))
        })
    }
    render(){
        return(
        <View style={Styles.container}>
            <Text>
                SearchLobby
            </Text>
            {this.state.lobbies.map((item,id)=>{
                return(
                    <TouchableOpacity
                        onPress={()=>{
                            this.props.navigation.navigate("Lobby",{id:item});
                        }}
                        key={id}
                    >
                    <Text>{item}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
        )
    }
    componentWillUnmount(){
        socket.off('lobby');
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    }
})