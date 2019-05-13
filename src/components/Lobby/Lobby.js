import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';
import socket from '../../socketio/socket';

export default class Lobby extends React.Component{
    state={
        id:false,
        creator:false,
        players:[],
    }

    componentWillMount(){
        const lobby = this.props.navigation.getParam('id');
        socket.emit('joinLobby',lobby);
        socket.on("lobbyInfo",(data)=>{
            this.setState({
                lobbyInfo:data,
                id:data._id,
                creator:data.creator,
                players:data.players,
            });
        });
        socket.on("playerJoined",(player)=>{
            this.setState(prevState =>({
                players:[...prevState.players,player],
            }));
        });
        socket.on("start",()=>{
            this.props.navigation.navigate("DuelField",{data:this.state.lobbyInfo});
        });
    }
    render(){
        return(
        <View style={Styles.container}>
            {this.state.id ?
            <View style={Styles.lobbyInfo}>
                <Text>LobbyID : {this.state.id}</Text>
                <Text>players :</Text>
            </View>
            :
            <Text>
                Could'nt find the Lobby Try Again !
            </Text>}
            {this.state.players.map((item,id)=>(
                    <View key={id}>
                        <Text>{item}</Text>
                    </View>
                )
            )}
        </View>
        )
    }
    componentWillUnmount(){
        socket.off('lobbyInfo');
        socket.off('playerJoinde');
        socket.off('start');
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    lobbyInfo:{
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    }
})