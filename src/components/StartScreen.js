import React from 'react';
import { View,Text,TouchableOpacity,StyleSheet,Image } from 'react-native';

export default class StartScreen extends React.Component{
    componentDidMount(){
    }
    render(){
        return(
            <View style={Styles.container}>
            <Image
                style={{width: 200}}
                resizeMode={'contain'}
                source={require('../../assets/icon.png')}
            />
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
        backgroundColor:'white'
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