import React from "react"
import BaseComponent from "@/components/BaseComponent"
import {View,TouchableOpacity} from "react-native"
import {Icon,Button,Text,Image } from "react-native-elements"
import { observer, inject } from "mobx-react";
import { observable } from "mobx";


// @inject("homeStore")
@observer
export default class LoadProgress extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      color:"red",
      schedule:this.props.schedule
    }
    if(this.props.schedule<30){
      this.state.color = "#52C41A"
    }else if(this.props.schedule<70){
      this.state.color = "#2F54EB"
    }else if(this.props.schedule<90){
      this.state.color = "#FAAD14"
    }else if(this.props.schedule>90){
      this.state.color = "#FA541C"
    }

  }
  componentWillUpdate(nextProps){
    if(nextProps.schedule<30){
      this.state.color = "#52C41A"
    }else if(nextProps.schedule<70){
      this.state.color = "#2F54EB"
    }else if(nextProps.schedule<90){
      this.state.color = "#FAAD14"
    }else if(nextProps.schedule>90){
      this.state.color = "#FA541C"
    }

  }

  render(){
    return (
      <View style={{flexDirection:"row",alignItems:"center",paddingBottom:10}}>
        <View style={{backgroundColor:"#ccc",borderRadius:20,height:10,width:100,overflow:"hidden",marginRight:10}}>
          <View style={{height:10,width:this.props.schedule,backgroundColor:this.state.color}}></View>
        </View>
        <Text>{this.props.schedule}</Text>
      </View>

    )
  }
}