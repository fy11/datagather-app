import React from "react";
import { View,Text,Image,ImageBackground } from "react-native";
import { inject,observer } from "mobx-react";
import { NavigationScreenProps } from "react-navigation";

import { RNCamera, FaceDetector } from 'react-native-camera';
import Video from 'react-native-video';
import {Button} from "react-native-elements" 

import ossUpload,{fileUploadByPath} from "@/components/ossUpload";
import { parseTime } from "@/utils/time"
import { getOssConfig } from "@/api/chat";
import RNFetchBlob from "rn-fetch-blob";

class Tab1Page extends React.Component<NavigationScreenProps> {
  constructor(props){
    super(props)
    this.state = {
      recordOptions:{
        quality: '720p',
        orientation:"auto",
      },
      type:"front",
      isPreview:0,
      previewData:null
    }
    this.store = this.props.homeStore;
    this.data = {
      imgSource:null
    };

  }
  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }
  takePicture = async ()=>{
    if(!this.refs.camera)return;
    var data = null;
    try {
      data = await this.refs.camera.takePictureAsync({
        skipProcessing: true,//fix camera takepicture 90 rotating
        fixOrientation: true,
        forceUpOrientation:true
      });
      this.refs.camera.pausePreview();
      this.setState({ isPreview:1,previewData:data});
    } catch (error) {
      
    }
    console.log('takePictureResponse ', data);
  }
  recordStart = async ()=>{
    if(!this.refs.camera)return;
    try {
      const promise = this.refs.camera.recordAsync(this.state.recordOptions);

      if (promise) {
        this.setState({ isRecording: true });
        const data = await promise;
        this.setState({ isRecording: false ,isPreview:2,previewData:data});
        console.log('takeVideo', data);
      }
    } catch (e) {
      console.error(e);
    }
  }
  recordStop = ()=>{
    if(!this.refs.camera||!this.state.isRecording)return;
    this.refs.camera.stopRecording();

  }
  switchCameraType = ()=>{
    this.setState({type:this.state.type != "front"?"front":"back"})
  }
  back = ()=>{
    if(this.state.isPreview){
      this.setState({isPreview:false})
      return 
    }
    this.props.navigation.goBack()
  }
  uploadFile = (path)=>{
    fileUploadByPath(path).then(msgData=>{
      if(this.state.isPreview == 1){
        msgData.width = msgData.width || this.data.imgSource.width;
        msgData.height = msgData.height || this.data.imgSource.height;
      }else{
        msgData.type = "video/mp4";
      }
      this.store.chat.postMsg(JSON.stringify(msgData),this.state.isPreview);
      this.props.navigation.goBack();
    })
  }
  renderCamera(){
    if(!this.state.focusedScreen)return null
    return (
      <RNCamera 
        ref="camera" style={{flex:1}}
        type={this.state.type}
        playSoundOnCapture={true}
        // faceDetectionMode="accurate" //fast  accurate
        onFacesDetected={(e)=>{
          console.log(e)
          // this.refs.camera.pausePreview();
          // this.refs.camera.takePictureAsync();
        }} // face 
        // onTextRecognized={(e)=>{console.log(e)}} // OCR
        // onBarCodeRead={(e)=>{console.log(e)}} // scan Qrcode
      >
        <Button 
          containerStyle={{position:"absolute",left:0,right:0,
          bottom:30,justifyContent:"center",alignItems:"center"}}
          buttonStyle={{width:100,height:100,borderRadius:50,borderWidth:10,borderColor:"#ccc",backgroundColor:"#fff"}}
          onPress={this.takePicture}
          onLongPress={this.recordStart}
          delayLongPress={1000}
          delayPressIn={500}
          onPressOut={this.recordStop}
        />
        <Button 
          icon={{name:"photo-camera"}}
          containerStyle={{position:"absolute",right:20,top:30}}
          buttonStyle={{backgroundColor:"rgba(0,0,0,0)"}}
          onPress={this.switchCameraType}
        />
      </RNCamera>

    )
  }
  renderPerview(){
    var dom = null;
    if(this.state.isPreview == 1){
      dom = ((
        <Image source={{uri:this.state.previewData.uri}}  style={{ width: "100%", height: "100%" }} onLoad={(res)=>{
          this.data.imgSource = res.nativeEvent.source;
        }} >
          </Image>
      ))
    }else if(this.state.isPreview == 2){
      dom = ((
        <Video 
          source={{uri:this.state.previewData.uri}}
          style={{
            flex:1
          }}
          repeat={true}
          posterResizeMode={"stretch"}
          resizeMode={"cover"}
          fullscreen={false}
          // controls={true}
        />
      ))
    }

    return (
      <View style={{flex:1}}>
        {dom}
        <View style={{position:"absolute",bottom:0,left:0,zIndex:9999,right:0,padding:10,display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
          <Button 
            icon={{name:"clear",color:"#fff"}}
            onPress={()=>{
              this.props.navigation.goBack()
            }}
          />
          <Button 
            icon={{name:"done",color:"#fff"}}
            onPress={()=>{
              this.uploadFile(this.state.previewData.uri)
            }}
          />
        </View>
        
      </View>
    );
    
  }
  render(){
    return (
      <View style={{flex:1}}>
        {this.state.isPreview?this.renderPerview():this.renderCamera()}
        <Button 
          icon={{name:"keyboard-backspace"}}
          containerStyle={{position:"absolute",left:20,top:30}}
          buttonStyle={{backgroundColor:"rgba(0,0,0,0)"}}
          onPress={this.back}
        />
        
      </View>
    )
  }
}

export default inject("homeStore")(observer(Tab1Page))