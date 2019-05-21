import React from 'react';
import { View,Text,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { soundObject } from '../../../assets/sounds/rev';

import socket from '../../socketio/socket';

export default class DuelField extends React.Component{
    initialState={
        bullet:2,
        opponentStatus:[true,true],
        alive:true,
        lock:true,
        poniter:null,
    }
    
    constructor(props){
        super(props);
        const data = this.props.navigation.getParam('data');
        let players = [];
        for(var player in data.players){
            if(data.players[player] != socket.id)
                players.push(data.players[player]);
        }
        data.players = players;
        this.state = data;
    }

    componentWillMount(){
        socket.on('DEAD',(id)=>{
            if(id == socket.id){ 
                this.setState({
                    alive:false,
                    lock: true,
                });
            }else{
                const index = this.state.players.indexOf(id);
                var newStatus = this.state.opponentStatus.slice(0);
                newStatus[index] = false;
                this.setState({
                    opponentStatus: newStatus,
                })
            }
        });
        socket.on('MISSED',()=>{
            // alert('a player missed');
        })
        socket.on('START_ROUND',()=>{
            this.startRound();
        });
        socket.on('FINISH',()=>{
            setTimeout(()=>{
                this.props.navigation.navigate('StartScreen');
            },3000);
        })
        this.startRound();
    }

    render(){
        console.log(this.state)
        return(
            <TouchableWithoutFeedback 
            onPress={this.fire.bind(this)}
            style={Styles.container}
            >
                <View style={Styles.container}>
                    <View style={Styles.top}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.pointTo(0)}
                        >
                            {this.state.opponentStatus[0] ?
                            <Text
                                style={this.state.poniter == 0 ? {color:'green'}:{}}
                            >
                                alive
                            </Text>
                            :
                            <Text>Dead</Text>}
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback
                            onPress={()=>this.pointTo(1)}
                        >
                            {this.state.opponentStatus[1] ?
                            <Text
                                style={this.state.poniter == 1 ? {color:'green'}:{}}
                            >
                                alive
                            </Text>
                            :
                            <Text>Dead</Text>}
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={Styles.bottom}>
                        <View>
                            {this.state.lock ?
                            <Text>
                                Duel Field !
                            </Text>
                            :
                            <Text>
                                Fire !
                            </Text>}
                        </View>
                        <View style={Styles.player}>
                            {this.state.alive ? 
                            <Text>alive</Text>
                            :
                            <Text>Dead</Text>}
                        </View>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    }

    componentDidUpdate(){
        if(this.state.header && this.finished()){
            socket.emit('HEADER_SAYS_MATCH_IS_FINISHED',this.state._id);
        }else if(this.state.header && !this.finished()){
            if(this.roundFinished()){
                setTimeout(()=>{
                    socket.emit('HEADER_SAYS_START_ROUND',this.state._id);
                },3000);
            }
        }
    }

    componentWillUnmount(){
        socket.off('DEAD');
        socket.off('MISSED');
        socket.off('START_ROUND');
        socket.off('NEXT_ROUND');
        socket.off('FINISH');
    }

    pointTo =(i)=>{
        this.setState({
            poniter: i,
        })
    }

    roundFinished =()=>{
        if( this.state.alive +
            this.state.opponentStatus[0] +
            this.state.opponentStatus[1] < 2){
            return true;
        }
        return false;
    }

    finished =()=>{
        if(this.state.round >= 5){
            return true;
        }
        return false;
    }

    startRound =()=>{
        const currentRound = this.state.round;
        this.setState({
            round: currentRound + 1,
            ...this.initialState,
        })
        this.forceRound(currentRound +1);
        setTimeout(()=>{
            this.setState({lock:false})
        },this.state.times[currentRound]);
    }

    forceRound =(round)=>{
        setTimeout(()=>{
            if(round == this.state.round){
                socket.emit('HEADER_SAYS_START_ROUND',this.state._id);
            }
        },15000);
    }

    fire(){
        if(this.state.bullet>0 && this.state.poniter != null){
            soundObject.replayAsync()
            if(this.state.lock){
                socket.emit('MISSED',this.state._id);
                this.setState(prevState =>({
                    bullet:prevState.bullet - 1,
                }))
            }else{
                socket.emit('SHOOT',
                {
                    id:this.state._id,
                    dead:this.state.players[this.state.poniter]
                });
                this.setState(prevState =>({
                    bullet:prevState.bullet - 1,
                }))
            }
        }
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'flex-start'
    },
    lobbyInfo:{
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    top:{
        height:'50%',
        width:'100%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    bottom:{
        height:'50%',
        width:'100%',
        flexDirection:'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    player:{
        flex:1,
        justifyContent:'center'
    }
})