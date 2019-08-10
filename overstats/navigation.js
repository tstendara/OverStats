import * as React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import statsScreen from './stats';
import Home from './App';
import LeaderBoard from './leaderBoard';

const MainNavigator = createStackNavigator({
  Main: { screen: Home },
  Profile: { screen: statsScreen },
  Leader: {screen: LeaderBoard}
});

const nav = createAppContainer(MainNavigator);
export default nav;
