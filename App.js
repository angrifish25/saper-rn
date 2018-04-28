import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import Game from './Components/Game';

const {height, width} = Dimensions.get('window')

export default class App extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Game complexity='easy'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  adContainer: { 
    alignSelf: 'stretch', 
    bottom: 0, 
    height: 90, 
    backgroundColor: '#FF0000', 
    position: 'absolute'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
