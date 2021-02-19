import React from "react";
import { View,Text,BackHandler,StyleSheet,Animated,Dimensions} from "react-native";
import { inject,observer } from "mobx-react";
import { NavigationScreenProps } from "react-navigation";
import { RNCamera, FaceDetector,Constants } from 'react-native-camera';
import { Icon} from 'react-native-elements';
import ossUpload from "@/components/ossUpload";
import { parseTime } from "@/utils/time"
import  {getOssConfig} from "@/api/chat";
import  {faceMessage,sumbitIdentity,addZbPhotos} from "@/api/identity";
// import Toast from "react-native-root-toast"
import {WebRTCComponent} from "@/components/BaseComponent"
import maskPersion from "./maskPersion";
import faceDetectCheck from "./faceDetectCheck";
import  Player  from "@/components/player";



class CameraDemo extends React.Component<NavigationScreenProps> {
  constructor(props){
    super(props)
    this.store = this.props.homeStore;
    this.state = {
      isPass:false,
      failNum:0,
      moveAnim: new Animated.Value(0),
     headerWidth:'',
      headerImage:'',
      // this.props.navigation.state.params.customerId
      image:this.props.navigation.state.params.customerId,
      person:this.props.navigation.state.params.customerId,
      
      // product:{
     
    // },
      width:'',
      recordOptions:{
        quality: '720p',
        orientation:"auto",
      }
    
 

  }
}

  componentDidMount() {
    this.setState({
      headerWidth:Dimensions.get("window").width,
    });
BackHandler.addEventListener("hardwareBackPress", function() {
        return true;
    })
  }
  componentWillUnmount() {
    this.refs.camera=null;
    // BackHandler.remove();

  }
  onFacesDetected=async(res)=>{
    if (!this.refs.camera&&!this.state.isPass)return;
    try {
      let cameraData = await this.refs.camera.takePictureAsync({
        width:720,
        quality:0.9,
        fixOrientation:true
      });
      // this.refs.camera.pausePreview();
      var result = await getOssConfig();
      
      var oss = {
        accessKeyId:result.data.accessid,
        policy:result.data.policy,
        signature:result.data.signature,
        key:`${result.data.dir}${parseTime(new Date(),"{y}/{m}/{d}/{h}/{i}/{s}/")}${Math.floor(Math.random()*1000000)}/${cameraData.uri.split("/")[cameraData.uri.split("/").length-1]}`,
        host:result.data.host,
        file:{
          uri:cameraData.uri,
          type:"image/jpeg",
          name:"1.jpg",
        }
      };   
      var res = await ossUpload(oss);
  
      if(this.props.navigation.state.params.to == 1){
        let data = {
          ...this.props.navigation.state.params,
          image:res.Location,
          customerId:this.store.customerId,
          chatSessionId:this.store.chatSessionId,
          productId:this.store.productId,
          authType:2,
          lastAuth:true,
        };
        
        var res = await sumbitIdentity(data);
        if(!res.data.code){
  
            const instructDatas={
              instructionJson:data,
              instructionId:data.instructionId,
            };
            addZbPhotos(instructDatas).then(res=>{
              if(!res.data.code){
                console.log('识别成功关闭。。。');  
                this.setState({isPass:true})
                // Toast.show('',{
                // position:1500,
                // });
                // let url = 'https://project-ichat.oss-cn-shanghai.aliyuncs.com/file/2019/11/14/10/40/26/246944/AY_通用_人证比对成功.mp3';
               Player.restart();
                this.props.navigation.goBack()
              }
          
           });
          

         
        } else {
          this.setState(item=>{
           return{failNum:item.failNum+1}
          });
          if(this.state.failNum>=3){
            const {data} = await sumbitIdentity({closeAuth:1,lastAuth:true, chatSessionId: this.store.chatSessionId, customerId: this.store.customerId,
              productId:this.store.productId ,});

              if(!data.code){
                Player.restart();
                this.props.navigation.goBack()
                return
              }
          }
      
          return
        
       
        
        }
      }else{

        let datas={
          image:this.state.image||133,
          imageUrl:res.Location,
          person:this.state.person||133,
        };
  
        this.props.navigation.replace('Authentication',datas);
      }

       
    }catch (error) {
      console.log(error);
    }

  };
  onFaceDetectionError=async(err)=>{
 await console.log(err);
  }
  
  
  // takePicture = async ()=>{
  //   if(!this.refs.camera)return;
  //   var data = null;
  //   try {
  //     data = await this.refs.camera.takePictureAsync();
  //     this.refs.camera.pausePreview();
  //   } catch (error) {
      
  //   }
  //   console.warn('takePictureResponse ', data);
  // }
  render(){
    var state=this.state;
    const  width = this.state.headerWidth<=360?this.state.headerWidth+1000:this.state.headerWidth+850;

    return (
      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.7)',display:'flex'}}>
        <RNCamera 
        autoFocus={RNCamera.Constants.AutoFocus.on}
        type={RNCamera.Constants.Type.front}
        // permissionDialogTitle={'请求相机权限'}
        // permissionDialogMessage={'应用没有获取到相机权限，请先到设置中为应用开启相机权限'}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        
        // onFaceDetectionError={this.onFaceDetectionError}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
        onFacesDetected={faceDetectCheck({fn:this.onFacesDetected})}
        captureAudio={false}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes,'aaaaa');
        }}
        ref="camera" style={{flex:1,flexDirection:'column',alignItems:'center'}}>
          {maskPersion()}               
          <Icon
            name='circle'
            type='font-awesome'
            color='#fff'
            size={60}
            onPress={this.onFacesDetected}
            containerStyle={{position:"absolute",bottom:10}} />
        </RNCamera>
        {/* <Button 
          title="takePicture"
          onPress={this.takePicture}
        />
        <Button 
          title="recordStart"
          onPress={this.recordStart}
        />
        <Button 
          title="recordStop"
          onPress={this.recordStop}
        /> */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    backgroundColor: 'transparent',
  },
  rectangle: {
      // height: 300,
      // width: 300,
      borderWidth: 1,
      borderColor: '#00FF00',
      backgroundColor: 'transparent'
  },
  rectangleText: {
      flex: 0,
      color: '#fff',
      marginTop: 400
  },
  border: {
      flex: 0,
      width: 200,
      height: 2,
      backgroundColor: '#00FF00',
  }
})

export default WebRTCComponent(inject("homeStore")(observer(CameraDemo)))