import React from "react";
import { View,Text } from "react-native";
import { inject,observer } from "mobx-react";
import { NavigationScreenProps } from "react-navigation";

class RouterDemoParams extends React.Component<NavigationScreenProps> {
  constructor(props){
    super(props)
    this.props.navigation
  }

  render(){
    var params = this.props.navigation.state;
    return (
      <View>
        <Text>params is:</Text>
        <Text>{params && params.text || "blank"}</Text>
      </View>
    )
  }
}

export default inject("homeStore")(observer(RouterDemoParams))