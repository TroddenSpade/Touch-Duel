import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity } from 'react-native';
import socket from '../../socketio/socket';

export default class CreateLobby extends React.Component{
    state={
        _id:false,
        players:[],
        header:true,
    }

    componentWillMount(){
        socket.on('DuelCreated',(data)=>{
            this.setState(data);
            socket.off("DuelCreated");
        });
        socket.emit('CreateDuel');
        socket.on("playerJoined",(player)=>{
            this.setState(prevState =>({
                players:[...prevState.players,player],
            }));
        }); 
        socket.on('START',()=>{
            this.props.navigation.navigate(
                `Field${this.state.players.length}`,
                {data:this.state});
        });
    }
    render(){
        return(
        <View style={Styles.container}>
            {this.state._id ?
            <View style={Styles.lobbyInfo}>
                <Text>LobbyID : {this.state._id}</Text>
            </View>
            :
            <Text>
                Could'nt Create a Lobby Try Again !
            </Text>}
            {this.state.players.map((item,id)=>(
                    <View key={id}>
                        <Text>player{id}: {item}</Text>
                    </View>
                )
            )}
            {this.state.players.length > 1 ?
            <TouchableOpacity
                onPress={()=>{
                    socket.emit('HEADER_SAYS_START_DUEL',this.state._id);
                }}
            >
                <Text>Start</Text>
            </TouchableOpacity>
            :null}
        </View>
        )
    }
    componentWillUnmount(){
        socket.emit("deleteLobby",this.state.id);
        socket.off('playerJoined');
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