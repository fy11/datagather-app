import React from "react";
import { View ,StyleSheet,Alert,TextInput,ScrollView,Image,TouchableOpacity,ImageBackground,Linking } from "react-native";
import { observer, inject } from "mobx-react";
import { Button,Text,Divider,Icon,CheckBox,Card} from 'react-native-elements';
import Toast from "react-native-root-toast"

import utils from "@/utils";
// import ImageViewer from 'react-native-image-zoom-viewer';

import idcard from "react-native-idcardreader"
import RNPrint from 'react-native-print';
import DingTalk from 'react-native-dingtalk';
import * as chatApi from "@/api/chat"

const styles = StyleSheet.create({


 
});

 class Debugging  extends React.Component {
  constructor(props){
    super(props);
   this.selectText=[],
   this.store = this.props.homeStore;
    this.state={

    }

  };
 //点击列表某一项的方法
  handleClickItem(){
    this.props.navigation.replace("ChatDemo");
  }

  handlePayment(){
    this.props.navigation.replace("Payment");
  }
  handlePay(){
    this.props.navigation.replace("Pay");
  }
  componentDidMount() {
// return this.getLIst()
    DingTalk.addListener("callbackByLogin",console.log);
    DingTalk.addListener("callbackByShare",console.log);
    DingTalk.init("dingoajszsjchxdeeqjvgx")
  }
 

  componentWillMount(){
  };

  render(){
    return (
      // <TouchableOpacity onPress={this.handleClickItem.bind(this)}>
        <View style={{height:'100%',width:'100%',display:'flex',}}>
        {/* <Image source={require("@/assets/images/bg.png")} style={{width: utils.window.screenW,height:utils.window.screenW*1165/870,position:"absolute",top:0,left:0,right:0,resizeMode:"contain"}} /> */}
        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
          <Text style={{textAlign:"center",color:'blue',width:"100%"}} >设备ID：{this.store.uniqueId}</Text>
          <Button title={"缴费"} onPress={this.handlePayment.bind(this)}/>
          <Button title={"支付"} onPress={this.handlePay.bind(this)}/>
          <Button title={"身份证读取开始"} onPress={()=>{
            idcard.start();
            idcard.on((e)=>{
              console.log(e)
              /* event 的结构
                addr:"地址"
                born:"出生年月日"
                effext:"有效期"
                id:"身份证"
                img:"base64"
                issueAt:"颁发机关"
                name:"名字"
                nation:"民族"
                passNum:null
                retType: 1 正常 2 外国人 3 港澳台
                timer:读取耗时
                visaTimes:0
              */
            })
          }}/>
          <Button title={"身份证读取结束"} onPress={()=>{
            idcard.stop();
          }}/>
          <Button title={"打印"} onPress={()=>{
             RNPrint.print({ filePath: 'https://graduateland.com/api/v2/users/jesper/cv' })
          }}/>
          <Button title={"照相"} onPress={()=>{
            this.props.navigation.replace("CameraDemo",{customerId:0});
          }}/>
          <Button title={"身份证读取"} onPress={()=>{
            this.props.navigation.replace("IdCardReaderPage",{customerId:0});
          }}/>
          <Button title={"钉钉授权"} onPress={()=>{
              DingTalk.sendAuth()
          }}/>
          <Button title={"钉钉分享-文本"} onPress={()=>{
            DingTalk.sendTextMessage("你好",false)
          }}/>
          <Button title={"钉钉分享-链接"} onPress={()=>{
            DingTalk.sendWebPageMessage({
              url:"http://www.baidu.com",
              title:"拜读s",
              content:"123213",
              thumbUrl:"http://www.baidu.com",
              isSendDing:false
            })
          }}/>
          <Button title={"钉钉分享-图片"} onPress={()=>{
            DingTalk.sendImageMessage({
              url:"http://www.baidu.com",
              isSendDing:false
            })
          }}/>
          <Button title={"TRTC 视频"} onPress={()=>{
            this.props.navigation.replace("DebuggingTRTC",{customerId:0});
          }}/>
          <Button title={"支付宝身份验证"} onPress={()=>{
            chatApi.appUserCertify({
              idNum:"",
              name:""
            }).then(res=>{
              if(res.data.success){
                var a = 'alipays://platformapi/startapp?appId=20000067&url='+encodeURIComponent(res.data.data.uri);
                Linking.canOpenURL(a).then(supported => {
                  if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                  } else {
                    return Linking.openURL(a);
                  }
                }).catch(err => console.error('An error occurred', err));
              }
            })
                        

          }}/>
        </View>
      </View>

     )
  }
}

export default inject(['homeStore'])(observer(Debugging));