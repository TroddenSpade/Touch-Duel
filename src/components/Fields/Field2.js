import React from 'react';
import { View,Text,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { soundObject } from '../../../assets/sounds/rev';

import socket from '../../socketio/socket';

export default class DuelField extends React.Component{
    initialState={
        bullet:1,
        opponent:true,
        alive:true,
        lock:true,
    }

    constructor(props){
        super(props);
        const data = this.props.navigation.getParam('data');
        this.state = data;
    }

    componentWillMount(){
        socket.on('DEAD',(id)=>{
            if(id == socket.id){ 
                this.setState({
                    alive:false,
                    lock:true
                });
            }else{
                this.setState({
                    opponent:false,
                });
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
        return(
            <TouchableWithoutFeedback 
            onPress={this.fire.bind(this)}
            style={Styles.container}
            >
                <View style={Styles.container}>
                    <View>
                        {this.state.opponent ? 
                        <Text>alive</Text>
                        :
                        <Text>Dead</Text>}
                    </View>
                    {this.state.lock ?
                    <Text>
                        Duel Field !
                    </Text>
                    :
                    <Text>
                        Fire !
                    </Text>}
                    <View>
                        {this.state.alive ? 
                        <Text>alive</Text>
                        :
                        <Text>Dead</Text>}
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

    roundFinished =()=>{
        if(this.state.alive && this.state.opponent){
            return false;
        }
        return true;
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
        if(this.state.bullet>0){
            soundObject.replayAsync()
            if(this.state.lock){
                socket.emit('MISSED',this.state._id);
                this.setState({
                    bullet:0,
                })
            }else{
                socket.emit('SHOOT',
                {
                    id:this.state._id,
                    dead:this.state.players[0]
                });
                this.setState({
                    bullet:0,
                })
            }
        }
    }
}

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    lobbyInfo:{
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    }
})