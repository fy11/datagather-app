import { View } from "react-native";

import React, { useEffect } from "react";
import TRTC,{ RTCVIew } from "react-native-trtc";
import { Text,Input,Button } from "react-native-elements"
import { useState } from "react";
import * as chatApi from "@/api/chat"
export default function(){
  const [state,setState] = useState({
    userId:"",
    roomId:"",
    userList:[]
  })
  useEffect(()=>{
    TRTC.addListener("onEnterRoom",(e)=>{
      console.log("onEnterRoom",e)
    })
    TRTC.addListener("onUserExit",(e)=>{
      console.log("onUserExit",e)
      if(~state.userList.indexOf(e.userId)){
        setState({...state,userList:state.userList.splice(state.userList.indexOf(e.userId),1)})
      }
    })
    TRTC.addListener("onUserEnter",(e)=>{
      console.log("onUserEnter",e)
      if(!~state.userList.indexOf(e.userId))
      setState({...state,userList:state.userList.concat(e.userId)})

    })
    TRTC.addListener("onError",(e)=>{
      console.log("onError",e)
    })

    return ()=>{
      TRTC.leaveChannel();
    }
  },[])
  
  return (
    <View>
      <View>
        <Text>房间号:</Text>
        <Input value={state.roomId} keyboardType={"number-pad"} onChangeText={(e)=>{setState({...state,roomId:e})}}/>
      </View> 
      <View>
        <Text>用户名:</Text>
        <Input value={state.userId} onChangeText={(e)=>{setState({...state,userId:e})}}/>
      </View> 
      <Button title="开始视频" onPress={async ()=>{
        const res = await chatApi.getUserSig({
          userId:state.userId
        })
        await TRTC.joinChannel({
          sdkAppId:res.data.data.appid,
          userId:state.userId,
          userSig:res.data.data.usersig,
          roomId:parseInt(state.roomId),
          role:20
        },0)
        TRTC.startLocalPreview();
      }}/>
      {/* <RTCVIew userId="" style={{height:100,width:100}}/> */}
      {
        state.userList.map(v=>{
          return <RTCVIew userId={v} key={v} style={{height:100,width:100}}/>
        })
      }
    </View>
  )
}