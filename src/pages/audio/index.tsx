import React from "react";
import { View,Text,Platform,TouchableWithoutFeedback, PanResponder,StyleSheet} from "react-native";
import { inject,observer } from "mobx-react";
import {Button} from 'react-native-elements';
import { NavigationScreenProps } from "react-navigation";
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import ossUpload from "@/components/ossUpload";
import { parseTime } from "@/utils/time"
import  {getOssConfig} from "@/api/chat";
import moment from "moment"
class AudioDemoPage extends React.Component<NavigationScreenProps> {
  sound: Sound;
  constructor(props){
    super(props)
    this.state = {
      recording:false,
      currentTime:0.0,
      opacity:1,
      // paused:
      hasPermission:false,
      finished:false,
      audioPath:AudioUtils.DocumentDirectoryPath + '/test.aac',
      btnTitle:'按住说话'
    }
  }

//     getOssConfig().then((result) => {
//       console.log(result,'res');
//       var oss = {
//         accessKeyId:result.data.accessid,
//         policy:result.data.policy,
//         signature:result.data.signature,
//         key:`${result.data.dir}${parseTime(new Date(),"{y}/{m}/{d}/{h}/{i}/{s}/")}${Math.floor(Math.random()*1000000)}/${image.path.split("/")[image.path.split("/").length-1]}`,
//         host:result.data.host,
//         file:{
//           uri:image.path,
//           type:image.mime,
//           name:image.path,
//         }
//       };   
//       return ossUpload(oss);
//   }).then((res) => {
//     this.setState({
//       avatarSource: this.state.avatarSource.concat(res.Location),
//     }); 
    
//   }).catch((err) => {
//     console.log(err);
//   });


  componentWillMount(){
    this.panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({recordTouch:1,recordClose:false,btnTitle:'松开发送'})
        this.recorderStart();
      },
      onPanResponderMove: (evt, gestureState) => {
        var recordClose = false;
        if(gestureState.dy <= -250){
          recordClose = true;
        }else{
          recordClose = false
        }
        recordClose !== this.state.recordClose &&this.setState({recordClose:recordClose})
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.setState({recordTouch:0,btnTitle:'按住说话'})
        this.recorderStop();
      },
    });
  }
  componentDidMount(){
    // this.requestPermission(this.recorderStart); 
  }
  componentWillUnmount(){
    if(this.state.recording){
      this.recorderStop();
    }
    this.playerStop();
  }
  playerStart = async ()=>{
    if(this.state.recording){
      await this.recorderStop();
    }
    setTimeout(() => {
      this.sound = new Sound(this.state.audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        this.sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }
  playerStop = ()=>{
    this.sound && this.sound.stop();
    this.sound && this.sound.release();
    this.sound = null;
  }

  requestPermission = (cb)=>{
    AudioRecorder.requestAuthorization().then((isAuthorised) => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;
      cb&&cb();
      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
        }
      };
    });
  }
  recorderStart = async ()=>{
    if(!this.state.hasPermission){
      this.requestPermission(this.recorderStart)
      return ;
    }
    // if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    // }

    this.setState({recording: true, paused: false,opacity:0.2,btnTitle:'松开发送'});
    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }
  recorderStop = async ()=>{
    this.setState({recording: false, paused: false,opacity:1});
    try {
      const filePath = await AudioRecorder.stopRecording();
      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }
  prepareRecordingPath = (audioPath)=>{
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }
  _finishRecording = (didSucceed, filePath, fileSize?)=>{
    console.log(`时间 ${this.state.currentTime} 路径: ${filePath} and size of ${fileSize || 0} bytes`);
    if(this.state.recordClose)return ;
    
    getOssConfig().then((result)=>{
      var oss = {
      accessKeyId:result.data.accessid,
      policy:result.data.policy,
      signature:result.data.signature,
      key:`${result.data.dir}${parseTime(new Date(),"{y}/{m}/{d}/{h}/{i}/{s}/")}${Math.floor(Math.random()*1000000)}/${filePath.split("/")[filePath.split("/").length-1]}`,
      host:result.data.host,
      file:{
          uri:Platform.select({
            ios:filePath,
            android:"file://"+filePath
          }),
          type:"audio/aac",
          name:"test.aac",
        }
      };   
      return ossUpload(oss); 
    }).then(res=>{
      console.log(res,'res');
      alert(JSON.stringify(res))
    }).catch(err=>{
      console.log(err,'err');
      alert(JSON.stringify(err));
    })

  }
  render(){
    return (
      <View style={{height:'100%',width:'100%',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
        <View style={{}}>
        {/* <Text>{this.state.currentTime}</Text>
        <Button 
          title="Player start"
          onPress={this.playerStart}
        />
        <Button 
          title="Player stop"
          onPress={this.playerStop}
        /> */}
        </View>
    
        <View style={{alignItems:'center',}}>
        <View
          // onLongPress={this.record}
          // onPressIn={this.onPressIn}
          // onPressOut={this.onPressOut}
          // style={styles.record}
          {...this._panResponder.panHandlers}
        >
   
          <Text style={{height:180,width:180,borderWidth:1,lineHeight:180,textAlign:'center',borderRadius:180,opacity:this.state.opacity}}>{this.state.btnTitle}</Text>
        </View>
        </View>
        <View style={[styles.recordModal,{display:this.state.recordTouch?"flex":"none",position:this.state.recordTouch?"absolute":"relative"}]}>
          <View style={styles.recordModalContent}>
            <View style={{width:102,height:102,borderWidth:1,flexDirection:'column-reverse'}}>
              <View style={{width:100,height:this.state.volumeLevel||0,backgroundColor:"#fff"}}></View>
            </View>
            <Text>
              {moment(this.state.currentTime*1000).utcOffset(0).format("HH:mm:ss")}
            </Text>
            <Text style={[styles.recordModalClose,this.state.recordClose?{color:"red"}:{color:'#fff'}]}>手指上划,取消发送</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default inject("homeStore")(observer(AudioDemoPage))

const styles = StyleSheet.create({
  recordModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right:0 ,
    top:'18%',
  //   zIndex:100,
    // height:'70%',
  // //  minHeight:'120%',
  // //   width:'100%',
  
    alignItems:"center",
  },
  recordModalContent: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:10,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  recordModalClose:{

  }
});
