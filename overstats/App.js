import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  Linking,
  TouchableHighlight,
  SegmentedControlIOS
} from 'react-native';
import axios from 'axios';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { zoomIn } from 'react-navigation-transitions'
import { Card } from 'react-native-paper';
import Pulse from 'react-native-pulse';
import { Font } from 'expo';
import statsScreen from './stats';
import LeaderBoard from './leaderBoard';



class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Official Overwatch Stat Tracker ',
      headerStyle: {
        backgroundColor: '#4A4C4E'
      },
      headerTitleStyle: {
        color: '#FA9C1D',
        fontFamily: 'over',
        fontSize: 30
        
      },
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      player: {},
      username: '',
      platform: ['pc', 'xbl', 'psn'],
      platformIndex: 0,
      origin: ['us', 'eu', 'asia'],
      originIndex: 0,
      owlLive: false,
      owlRewatch: false,
      loading: false,
      inputFocused: false
    };
    this.getInfo = this.getInfo.bind(this);

  }

  async componentDidMount() {
    let fonts = await this.loadAssets();
    fonts;

    axios
      .get(`https://protected-shelf-73940.herokuapp.com/OWLLiveMatch`)
      .then(res => {
        const liveChecker = res.data.data.liveMatch.liveStatus;
        if (liveChecker === 'LIVE' || liveChecker === 'UPCOMING') {
          const team1 = res.data.data.liveMatch.competitors[0].name;
          const team1Logo = res.data.data.liveMatch.competitors[0].logo;
          const team2 = res.data.data.liveMatch.competitors[1].name;
          const team2Logo = res.data.data.liveMatch.competitors[1].logo;
        }
       
        liveChecker === 'UPCOMING' || liveChecker === undefined
          ? this.setState({ owlRewatch: true })
          : this.setState({ owlRewatch: false });
        liveChecker === 'LIVE'
          ? this.setState({ owlLive: true })
          : this.setState({ owlLive: false });
      })
      .catch(err => console.log(err));
  }

  async loadAssets(){
    await Font.loadAsync({
      'kover': require('./assets/koverwatch.ttf'),
      'over': require('./assets/bignoodletoo.ttf')
    })
  }

  getInfo() {
    this.setState({ loading: true });

    {
      /* account info */
    }
    const platform = this.state.platform[this.state.platformIndex];
    const origin = this.state.origin[this.state.originIndex];
    const tag = this.state.username;

    axios
      .post('https://protected-shelf-73940.herokuapp.com/overwatch', {
        platform: platform,
        origin: origin,
        username: tag,
      })
      .then(res => {
        this.setState({ loading: false });
        this.setState({ player: res.data });

        this.props.navigation.push('stats', {
          platform: this.state.platform[this.state.platformIndex],
          origin: this.state.origin[this.state.originIndex],
          level: this.state.player.level,
          fullUsername: this.state.username,
          username: this.state.player.username,
          portrait: this.state.player.portrait,
          comp: this.state.player.competitive.rank_img,
          rank: this.state.player.competitive.rank,
        });
        this.setState({ username: '' });
        // this.loadAfter()
      })

      .catch(err => {
        this.setState({ loading: false });
        console.log(err);
      });

      
  }

  // loadAfter(){
  //   axios
  //     .post('https://protected-shelf-73940.herokuapp.com/overwatch', {
  //       platform: 'pc',
  //       origin: 'us',
  //       username: 'dream1234-2695'
  //     })
  //     .then(res => {
  //       console.log('should be on stats page!', res.data);
  //       this.props.navigation.push('stats', {
  //         otherUsername: res.data.username
  //       })
  //     })
  // }
  


  render() {
    const owl = (
      <Image
        source={{
          uri:
            'https://searchcomponent.s3.us-east-2.amazonaws.com/searchpngs/586273b931349e0568ad89df.png',
        }}
      />
    );
    return (
      <View style={{ padding: 60, justifyContent: 'center' }}>
        <Image
          source={{
            uri:
              'https://searchcomponent.s3.us-east-2.amazonaws.com/searchpngs/586273b931349e0568ad89df.png',
          }}
          style={{ width: 200, height: 200, alignSelf: 'center', top: -40 }}
        />

        <Card style={{ padding: 10, marginTop: -13, marginBottom: 5 }}>
          <TextInput
            onPress={ this.handleFocus }
            style={{ fontFamily: 'kover', height: 20, marginBottom: -5 }}
            placeholder="Username-1234"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            
          />
        </Card>

        <SegmentedControlIOS
          style={{fontFamily: 'over'}}
          values={['US', 'EU', 'ASIA']}
          tintColor="grey"
          selectedIndex={this.state.originIndex}
          onChange={event => {
            this.setState({
              originIndex: event.nativeEvent.selectedSegmentIndex,
            });
          }}
        />

        <SegmentedControlIOS
          style={{ marginTop: 5}}
          values={['PC Master ', 'Xbox', 'Psn']}
          tintColor="grey"
          selectedIndex={this.state.platformIndex}
          onChange={event => {
            this.setState({
              platformIndex: event.nativeEvent.selectedSegmentIndex,
            });
          }}
        />

        <Text />
        <TouchableHighlight
          title="Find profile"
          style={styles.button}
          onPress={() => this.getInfo()}>
          <Text style={{ fontFamily: 'kover', color: 'white', fontSize: 17 }}>Find Profile</Text>
        </TouchableHighlight>

        {this.state.owlLive ? (
<View style={{ paddingTop: 8, paddingBottom: 12 }}>
            <Card
              style={{ backgroundColor: 'white' }}
              onPress={() =>
                Linking.openURL('https://www.twitch.tv/overwatchleague')
              }>
              <Pulse
                color="red"
                diameter={50}
                speed={30}
                numPulses={1}
                duration={10}
                style={{ left: 110, top: -5 }}
              />
              <Text
                style={{
                  fontFamily: 'kover',
                  alignSelf: 'center',
                  color: 'orange',
                  size: 30,
                  padding: 10,
                }}>
                Overwatch League status:{' '}
                <Text style={{ color: 'orange', fontFamily: 'over' }}>Live</Text>
              </Text>
              <Text style={{color: 'grey', fontFamily:'over', alignSelf: 'center', fontSize: 15}}>Watch Now Here :</Text>
            </Card>

            <Card
              style={{ backgroundColor: 'orange', borderRadius: 20, width: 100, height: 50, selfAlign: 'center', left: 80, top: 10}}
              onPress={() =>
                Linking.openURL('https://www.twitch.tv/overwatchleague')
              }>
              <Image
                source={{
                  uri:
                    'https://searchcomponent.s3.us-east-2.amazonaws.com/searchpngs/kisspng-twitch-streaming-media-video-game-logo-live-stream-5aeba5fa4a9ac8.7470922215253928903056+(1).png',
                }}
                style={{
                  width: 110,
                  height: 70,
                  alignSelf: 'center',
                  resizeMode: 'stretch',
                  bottom: 15
                }}
              />
            </Card>
          </View>
        ) : null}

        {this.state.owlRewatch ? (
          <View style={{ paddingTop: 8, paddingBottom: 12 }}>
            <Card
              style={{ backgroundColor: 'white' }}
              onPress={() =>
                Linking.openURL('https://www.twitch.tv/overwatchleague')
              }>
              <Text
                style={{
                  alignSelf: 'center',
                  color: 'orange',
                  size: 30,
                  padding: 10,
                  fontFamily: 'kover'
                }}>
                Overwatch League Status:{' '}
                <Text style={{ color: 'orange', fontFamily: 'over' }}>Rerun</Text>
              </Text>
              <Text style={{color: 'grey', fontFamily:'over', alignSelf: 'center', fontSize: 15}}>Watch Now Here :</Text>
            </Card>

            <Card
              style={{ backgroundColor: 'orange', borderRadius: 20, width: 100, height: 50, selfAlign: 'center', left: 80, top: 10}}
              onPress={() =>
                Linking.openURL('https://www.twitch.tv/overwatchleague')
              }>
              
              <Image
                source={{
                  uri:
                    'https://searchcomponent.s3.us-east-2.amazonaws.com/searchpngs/kisspng-twitch-streaming-media-video-game-logo-live-stream-5aeba5fa4a9ac8.7470922215253928903056+(1).png',
                }}
                style={{
                  width: 110,
                  height: 70,
                  alignSelf: 'center',
                  resizeMode: 'stretch',
                  bottom: 15
                }}
              />
            </Card>
          </View>
        ) : null}

        {this.state.loading ? (
          <View style={[styles.container, styles.horizontal]}>
            <Image source={{uri: 'https://media.giphy.com/media/ft5v741jEZEWsAfxJy/giphy.gif'}} style={{ width: 150, height: 150, alignSelf: 'center'}}></Image>
          </View>
        ) : null}

        <TouchableHighlight
          title="Find profile"
          style={{alignItems: 'center',
          backgroundColor: 'white',
          padding: 10,
          fontFamily: 'over',
          borderRadius: 10
          }}>
          <Text style={{ fontFamily: 'kover', color: 'black', fontSize: 17, padding: 10, backgroundColor: 'orange', borderRadius: 5, left:2 }} onPress={()=> this.props.navigation.navigate('leader')}>LeaderBoard</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const AppNavigator = createStackNavigator(
  {
    Homescreen: Home,
    stats: statsScreen,
    leader: LeaderBoard 
  },
  {
    initialRouteName: 'Homescreen',
    transitionConfig: () => zoomIn(),
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    bottom: 200,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
    fontFamily: 'over'
  },
  watchNowButton: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 2
  },
});

export default createAppContainer(AppNavigator);
