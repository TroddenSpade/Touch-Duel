import React from 'react';
import { 
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback } from 'react-native';
import { soundObject } from '../../../assets/sounds/rev';

import socket from '../../socketio/socket';

export default class DuelField extends React.Component{
    initialState={
        bullet:3,
        playersStatus:[true,true,true],
        playersPointer:[90,-180,-90,0],
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
        players.push(socket.id);
        data.players = players;
        this.state = data;
    }

    componentWillMount(){
        socket.on('POINTING',(data)=>{
            const from = this.state.players.indexOf(data.from);
            const to = this.state.players.indexOf(data.to);
            var newPointer = this.state.playersPointer.slice(0);
            if(to - from == 1 || to - from + 4 == 1){
                newPointer[from] = this.initialState.playersPointer[from] - 45;
            }else if(to - from == 3 || to - from + 4 == 3){
                newPointer[from] = this.initialState.playersPointer[from] + 45;
            }else{
                newPointer[from] = this.initialState.playersPointer[from];
            }
            this.setState({
                playersPointer: newPointer,
            })
        })
        socket.on('DEAD',(id)=>{
            if(id == socket.id){
                this.setState({
                    alive:false,
                    lock: true,
                });
            }else{
                const index = this.state.players.indexOf(id);
                var newStatus = this.state.playersStatus.slice(0);
                newStatus[index] = false;
                this.setState({
                    playersStatus: newStatus,
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
        return(
            <TouchableWithoutFeedback 
                onPress={this.fire.bind(this)}
                style={Styles.container}
            >
                <View style={Styles.container}>
                    <View style={Styles.top}>
                        <TouchableWithoutFeedback
                            onPress={()=>this.pointTo(1)}
                        >
                            {this.state.playersStatus[1] ?
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[1]}deg`}]},
                                    this.state.poniter == 1 ? Styles.chosen:{}
                                ]}
                                source={require('../../../assets/picture/hg2.png')}
                            />
                            :
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[1]}deg`}]},
                                ]}
                                source={require('../../../assets/picture/hd2.png')}
                            />}
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={Styles.mid}>
                    <TouchableWithoutFeedback
                            onPress={()=>this.pointTo(0)}
                        >
                            {this.state.playersStatus[0] ?
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[0]}deg`}]},
                                    this.state.poniter == 0 ? Styles.chosen:{}
                                ]}
                                source={require('../../../assets/picture/hg1.png')}
                            />
                            :
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[0]}deg`}]},
                                ]}
                                source={require('../../../assets/picture/hd1.png')}
                            />}
                        </TouchableWithoutFeedback>
                        {this.state.lock ?
                        <View>
                            <Image
                                style={{height: 100}}
                                source={require('../../../assets/picture/duelfield.png')}
                            />
                        </View>
                        :
                        <View>
                            <Image
                                style={{height: 100}}
                                source={require('../../../assets/picture/fire.png')}
                            />
                        </View>}
                        <TouchableWithoutFeedback
                            onPress={()=>this.pointTo(2)}
                        >
                            {this.state.playersStatus[2] ?
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[2]}deg`}]},
                                    this.state.poniter == 2 ? Styles.chosen:{}
                                ]}
                                source={require('../../../assets/picture/hg3.png')}
                            />
                            :
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[2]}deg`}]},
                                ]}
                                source={require('../../../assets/picture/hd3.png')}
                            />}
                        </TouchableWithoutFeedback>
                    </View>

                    <View style={Styles.bottom}>
                        <View style={Styles.player}>
                            {this.state.alive ? 
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[3]}deg`}]}
                                ]}
                                source={require('../../../assets/picture/hg4.png')}
                            />
                            :
                            <Image
                                style={[
                                    Styles.playerImg,
                                    {transform:[{ rotate: `${this.state.playersPointer[3]}deg`}]},
                                ]}
                                source={require('../../../assets/picture/hd4.png')}
                            />}
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
        socket.off('POINTING');
        socket.off('DEAD');
        socket.off('MISSED');
        socket.off('START_ROUND');
        socket.off('NEXT_ROUND');
        socket.off('FINISH');
    }

    pointTo =(i)=>{
        socket.emit('POINT_TO',{
            id:this.state._id,
            from:socket.id,
            to:this.state.players[i],
        })
        this.setState({
            poniter: i,
        })
    }

    roundFinished =()=>{
        if( this.state.alive +
            this.state.playersStatus[0] +
            this.state.playersStatus[1] +
            this.state.playersStatus[2] < 2){
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
        justifyContent:'space-around'
    },
    lobbyInfo:{
        flexDirection:'column',
        justifyContent: "center",
        alignItems: 'center',
    },
    top:{
        height:'30%',
        width:'100%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    mid:{
        height:'30%',
        width:'100%',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-around'
    },
    bottom:{
        height:'30%',
        width:'100%',
        flexDirection:'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    },
    player:{
        flex:1,
        justifyContent:'center'
    },
    playerImg:{
        width: 50,
        height: 50,
    },
    chosen:{
        borderWidth:2,
        borderRadius:10,
        borderColor: 'green',
    }
    
})