import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';

import StartScreen from './src/components/StartScreen';
import Lobby from './src/components/Lobby';
import DuelField from './src/components/DuelField';

const AppNavigator = createSwitchNavigator({
  StartScreen: StartScreen,
  Lobby: Lobby,
  DuelField: DuelField,
},{
  initialRouteName : "StartScreen"
});
const AppContainer = createAppContainer(AppNavigator);


export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}