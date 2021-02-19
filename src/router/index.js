import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  withNavigation,
  BottomTabBar
} from 'react-navigation';

import store from "@/store";
import { NavigationActions, StackActions } from "react-navigation";

export default createAppContainer(
  withNavigation(
    createStackNavigator(
      {
        ScreenProtect: {
          screen: require("@/pages/screensaver").default,
          navigationOptions: {
            // header: null,
          },
        },
      },
      {
        initialRouteName: 'ScreenProtect'
      }
    )
  )
);

var isTransitioning = false;
var callbackList = [];

export function onNavigationStateChange(prevState, newState, action) {
  isTransitioning = newState.isTransitioning;
  if (prevState.isTransitioning == false && newState.isTransitioning == true) {
    var fn = null;
    while ((fn = callbackList.pop())) {
      fn && fn();
    }
  }
}

export function getTransitioning() {
  return isTransitioning;
}

export function pushCallback(fn) {
  if (callbackList.length <= 0) {
    callbackList.push(fn);
  }
  return;
}

var timer = 0;

export function goBackUp(fn) {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    store.homeStore.router.dispatch(NavigationActions.back({}));
    store.homeStore.router.dispatch(
      StackActions.push({ routeName: 'SignInPage' })
    );
  }, 100);
  return;
}
