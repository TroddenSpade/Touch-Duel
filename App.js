import React from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';

import StartScreen from './src/components/StartScreen';
import Lobby from './src/components/Lobby';
import Field2 from './src/components/Fields/Field2';
import Field3 from './src/components/Fields/Field3';
import Field4 from './src/components/Fields/Field4';

const AppNavigator = createSwitchNavigator({
  StartScreen: StartScreen,
  Lobby: Lobby,
  Field2: Field2,
  Field3: Field3,
  Field4: Field4,
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