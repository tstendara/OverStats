import * as React from 'react';
import { Text, View, StyleSheet, Image} from 'react-native';
import axios from 'axios';
import { Font } from 'expo';

class statsScreen extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      stats: {},
      mostPlayedStats: {},
      loadStats: false
    };

  }

  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('username'),
      headerStyle: {
      backgroundColor: '#FFFFFF',
      },
     headerTintColor: '#FA9C1D',
      headerTitleStyle: {
      color: '#FA9C1D',
    },
    };
  }

  async componentDidMount(){
    await this.loadAssets();

    let { navigation } = this.props;
    const name = navigation.getParam('fullUsername');
    const plat = navigation.getParam('platform');
    const ori = navigation.getParam('origin');
    
    axios
      .post('https://protected-shelf-73940.herokuapp.com/stats', {
        platform: plat,
        username: name
      })
      .then((res) => {
        this.setState({ stats: res.data })

        axios
            .get(`https://ow-api.com/v1/stats/${plat}/${ori}/${name}/heroes/${this.state.stats.MostPlayed[0]}`)
        .then(res =>{
          let obj = res.data.competitiveStats.careerStats;
          let top = this.state.stats.MostPlayed[0];

          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              this.setState({ mostPlayedStats: obj[key].average, loadStats: true})
            }
          }

        })
        .catch(err => console.log(err))
       
      })
      .catch(err => console.log(err))
  }

  async loadAssets(){
    await Font.loadAsync({
      'kover': require('./assets/koverwatch.ttf'),
      'over': require('./assets/bignoodletoo.ttf')
    })
  }
  
  render(){
    let { navigation } = this.props;
    const level = navigation.getParam('level', 'NO-ID');
    const portrait = navigation.getParam('portrait', 'NO-ID');
    const rank = navigation.getParam('comp', 'NO-ID');
    const rankNum = navigation.getParam('rank', 'NO-ID');
    
    return(
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'left', backgroundColor: '#4A4C4E', paddingTop: 10}}>
      <Image source={{uri: `${portrait}`}}
       style={{width: 180, height: 130, alignSelf: 'center', borderRadius: 35}} />
      <Text style= {{fontFamily: 'kover', alignSelf: 'center', color: 'white', paddingTop: 7, fontSize: 17}}> Level {level}</Text>
      <Text style={{fontFamily: 'kover',fontSize: 17, alignSelf: 'center', color: 'white', paddingTop: 7, paddingBottom: 7}}> Rank {rankNum} </Text>
      <Image source={{uri: `${rank}`}}
       style={{width: 100, height: 60, alignSelf: 'center'}} />

       {(this.state.loadStats) ? 
    
       <View style={styles.container}>
         <View style={ styles.groups }>
          <Text style={ styles.title }>Average Stats</Text>
          <Text style={ styles.subTitle }>Elims per 10 min:</Text>
          <Text style={ styles.statsText }>{this.state.stats.averageStats.eliminations_avg_per_10_min}</Text>
          <Text style={ styles.subTitle }>Deaths per 10 min:</Text>
          <Text style= { styles.statsText }>{this.state.stats.averageStats.deaths_avg_per_10_min}</Text>
          <Text style={ styles.subTitle }>Damage per 10 min:</Text>
          <Text style={ styles.statsText }>{this.state.stats.averageStats.all_damage_done_avg_per_10_min}               </Text>
          
         </View>
  
         <Image source={{uri: `${this.state.stats.MostPlayed[1].img}`}} style={ styles.BorderClass }></Image>
         <View style={ styles.groups }>
          <Text style={ styles.title }>{ this.state.stats.MostPlayed[0] }</Text>
          <Text style={ styles.subTitle }>Elims per 10 min:</Text>
          <Text style={ styles.statsText }>{this.state.mostPlayedStats.eliminationsAvgPer10Min}</Text>
          <Text style={ styles.subTitle }>Deaths per 10 min:</Text>
          <Text style= { styles.statsText }>{this.state.mostPlayedStats.deathsAvgPer10Min}</Text>
          <Text style={ styles.subTitle }>Damage per 10 min:</Text>
          <Text style= { styles.statsText }>{this.state.mostPlayedStats.allDamageDoneAvgPer10Min}</Text>

         </View>
         
      </View>
         :
         <View style={styles.container}>
         <View style={ styles.groups }>
        <View style={{padding: 60, justifyContent: 'center'}}>
            <Image source={{uri:'https://media.giphy.com/media/dy4pigyG5oLJdtZg2g/giphy.gif'}} style={{ width: 60, height: 60, alignSelf: 'center', top: -40 , left: 115}}></Image>
        </View>
         </View>
         <View style={ styles.groups }>
         </View>
      </View>
       }
    </View>
  
    )  
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    width: 120, 
    height: 200, 
    backgroundColor: 'orange',
    borderRadius: 5
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
    color: 'white',
    fontFamily: 'over'
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    paddingTop: 7,
    fontFamily: 'kover'
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

export default statsScreen