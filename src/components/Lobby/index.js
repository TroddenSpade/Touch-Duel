import React from 'react';
import { View,Text,StyleSheet,Button } from 'react-native';
import { createAppContainer,createStackNavigator } from 'react-navigation';

import SearchLobby from './SearchLobby';
import CreateLobby from './CreateLoby';
import Lobby from './Lobby';

class LobbyOption extends React.Component{
    render(){
      return(
        <View style={Styles.container}>
            <Text>
                Lobby
            </Text>
            <Button
              title="CreateLobby"
              onPress={()=>
                this.props.navigation.navigate("CreateLobby")
              }
            />
            <Button
              title="NearbyLobbies"
              onPress={()=>
                this.props.navigation.navigate("LobbySearch")
              }
            />
        </View>
      )
    }
}

const LobbyNav = createStackNavigator({
    LobbyOption:{
      screen: LobbyOption,
      navigationOptions: {
        header: null,
      }
    },
    LobbySearch: SearchLobby,
    CreateLobby: CreateLobby,
    Lobby: Lobby,
},{
    initialRouteName: "LobbyOption"
});
export default createAppContainer(LobbyNav);

const Styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})