import React from "react";
import { View,Text, Alert, Button } from "react-native";
import { inject,observer } from "mobx-react";
import {NavigationEventSubscription, NavigationScreenProps} from "react-navigation"

class RouterDemoPage extends React.Component<NavigationScreenProps> {
  focusSubs: NavigationEventSubscription | null;
  blurSubs: NavigationEventSubscription | null;
  constructor(props){
    super(props)
    this.focusSubs = this.props.navigation.addListener("willFocus",this.willFocus)
    this.blurSubs = this.props.navigation.addListener("willBlur",this.willBlur)
  }
  navigate = ()=>{
    this.props.navigation.navigate("Tab3")
  }
  goBack = ()=>{
    this.props.navigation.goBack()
  }
  replace = ()=>{
    this.props.navigation.replace("Tab3")
  }
  passParams = ()=>{
    this.props.navigation.navigate("Tab3",{text:"text"})
  }
  willFocus = ()=>{
    Alert.alert("page will focus")
  }
  willBlur = ()=>{
    Alert.alert("page will blur")
  }

  componentWillUnmount(){
    this.focusSubs && this.focusSubs.remove();
    this.blurSubs && this.blurSubs.remove();
  }
  render(){
    return (
      <View>
        <Button
          title="navigate"
          onPress={this.navigate}
        />
        <Button
          title="goBack"
          onPress={this.goBack}
        />
        <Button
          title="replace"
          onPress={this.replace}
        />
        <Button
          title="pass params"
          onPress={this.passParams}
        />
      </View>
    )
  }
}

export default inject("homeStore")(observer(RouterDemoPage))