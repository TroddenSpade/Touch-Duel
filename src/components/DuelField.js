import React from 'react';
import { View,Text,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { soundObject } from '../../assets/sounds/rev';

import socket from '../socketio/socket';

export default class DuelField extends React.Component{
    initialState={
        bullet:1,
        opponent:true,
        alive:true,
        lock:true,
    }
    
    constructor(props){
        super(props);
        this.state = {
            ...this.initialState,
            round: 0,
        }
    }

    componentWillMount(){
        const data = this.props.navigation.getParam('data');
        this.setState({
            data:data,
        })
        socket.on('dead',(id)=>{
            if(id == socket.id){ 
                this.setState({
                    opponent:false
                });
            }else{
                this.setState({
                    alive:false,
                });
            }
        });
        socket.on('missed',()=>{
            alert('a player missed');
        })
        this.timer(0,data);
        this.forceRound(0);
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
        if(this.roundFinished()){
            setTimeout(()=>{
                this.nextRound();
            },3000);
        }
    }

    componentWillUnmount(){
        socket.off('dead');
        socket.off('missed');
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

    timer =(i,data)=>{
        setTimeout(()=>{
            this.setState({
                lock:false,
            })
        },data.times[i])
    }

    nextRound =()=>{
        if(this.finished()){
            setTimeout(()=>{
                this.props.navigation.navigate('StartScreen');
            },2000);
        }else{
            this.setState(prevState => ({
                round: prevState.round + 1,
                ...this.initialState,
            }))
            this.timer(this.state.round,this.state.data);
            this.forceRound(this.state.round);
        }
    }

    forceRound =(round)=>{
        setTimeout(()=>{
            if(round == this.state.round){
                this.nextRound();
            }
        },15000);
    }

    fire(){
        if(this.state.bullet>0){
            soundObject.replayAsync()
            if(this.state.lock){
                socket.emit('missed',this.state.data._id);
                this.setState({
                    bullet:0,
                })
            }else{
                socket.emit('shoot',this.state.data._id);
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
        justifyContent: "center",
        alignItems: 'center',
        justifyContent:'space-around'
    },
    lobbyInfo:{
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    }
})