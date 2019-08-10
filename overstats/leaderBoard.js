import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground
} from 'react-native';
import axios from 'axios';

class LeaderBoard extends React.Component {
  constructor(props){
    super(props);
    this.state={
    }
    
  }

  componentDidMount(){
    axios.get('https://protected-shelf-73940.herokuapp.com/top10')
    .then(res => {
      this.setState({leaderBoard: res.data, loaded: true, loadScreen: false})
    })
    .catch(err => console.log(err))
  }

  
  render(){
    return(
      <View>
      {(this.state.loaded ? (
        <View style={styles.container}>
         <View style={ styles.groups }>
          <Text style={ styles.title }>Top 10 Players</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[0]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[1]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[2]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[3]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[4]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[5]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[6]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[7]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[8]}</Text>
          <Text style={ styles.statsText }>{this.state.leaderBoard[9]}</Text>
         </View>
         </View>
         
      )
      :
      null
      )}
      <ImageBackground source={{uri: 'https://i.pinimg.com/originals/fe/02/e4/fe02e45cf5c57e01452288140e0a62d5.jpg'}} style={{width: '100%', height: '100%'}}></ImageBackground>
  </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
 flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999999
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    left: 180
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 10,
  },
  groups: {
    width: 200, 
    height: 500, 
    backgroundColor: 'orange',
    borderRadius: 5,
    top: 280
  },
  subTitle: {
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
    paddingTop: 12
  },
  statsText: {
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'over',
    paddingTop: 20
  },
  title: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    paddingTop: 7,
    fontFamily: 'kover',
    paddingTop: 7
  },
  BorderClass: {
 // Setting up image width.
  justifyContent: 'center', resizeMode: 'stretch', selfAlign: 'center',
  width: 100,
 // Setting up image height.
 height: 100,
 
 // Set border width.
 borderWidth: 2,
 
 // Set border color.
 borderColor: 'white',
 }
})

export default LeaderBoard;