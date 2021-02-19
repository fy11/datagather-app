import { FlatList,ActivityIndicator } from "react-native";
import React from "react"

class FlatListLoadding extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    if(!this.props.load){
      return null//( <ActivityIndicator size="large" color="#000" />)
    }
    return (
      <FlatList {...this.props}/>
    )
  }
}

export default FlatListLoadding