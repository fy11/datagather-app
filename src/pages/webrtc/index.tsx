import React from "react";
import { View,Text,Platform,TouchableWithoutFeedback, PanResponder,StyleSheet} from "react-native";
import { inject,observer } from "mobx-react";
import {Button} from 'react-native-elements';
import { NavigationScreenProps } from "react-navigation";
import * as webrtc from "./webrtc"
import BaseComponent from "@/components/BaseComponent";

class WebRTCDemoPage extends React.Component<NavigationScreenProps> {
  constructor(props){
    super(props)
    this.state = {
      recording:false,
      streams:[]
    }
  }

  async componentWillMount(){

  }

  async componentDidMount(){
    this._initRtc(this.props)
 
  }
  _initRtc= async (props)=>{
    setTimeout(async ()=>{
    await webrtc.getUserMedia(props);
    },1000)
    }
  _releaseRtc=()=>{
  webrtc.release();

  }

  
  componentWillUnmount(){
    this._releaseRtc();
  }
  
  render(){
    return null;
    return (
      <View style={{height:'100%',width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
        {/* {webrtc.stream&&webrtc.stream.toURL()&&<RTCView streamURL={webrtc.stream.toURL()} mirror={true} style={{width:200,height:200}}/>}
        {Object.values(webrtc.streams).map(stream=>{
          return <RTCView streamURL={stream} key={stream} style={{width:200,height:200}}/>
        })} */}
      </View>
    )
  }
}

export default BaseComponent(inject("homeStore")(observer(WebRTCDemoPage)))

const styles = StyleSheet.create({

});
