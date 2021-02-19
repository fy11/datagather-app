import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Constant} from "@/utils/environment";
import {deviceGetByCode,getAiAbilityList} from "@/api/sensor"

var ws,tt;
class InitWs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
    };
  }
  async componentDidMount() {
    try {
      const  device= await this.getStatus();
      const strDevice=JSON.stringify({code:device});
      console.log(strDevice,'strDevice');
      if(device){
       this.createWebSocket(strDevice)
      }
    } catch (error) {
      console.log(err,'err');
    }
    
  }
  createWebSocket(strDevice) {
    try {
     this.ws = new WebSocket(Constant.monitoringUrl);
     this.init(strDevice);
    } catch(e) {
      console.log('catch');
    this.reconnect(strDevice);
    }
  }
 init(strDevice) {
  this.ws.onclose =  ()=> {
      console.log('链接关闭');
      this.reconnect(strDevice);
    };  
 ws.onerror = ()=>{
      console.log('发生异常了');
      this.reconnect(strDevice);
    };
   ws.onopen = ()=>{
      console.log('连上了');
      this.ws.send(strDevice);
    };
   ws.onmessage = (e)=>{
      //拿到任何消息都说明当前连接是正常的
      console.log('接收到消息',e);
      if(e){
        const status=JSON.parse(e.data).serviceStatus;
 
        // if(status){
          this.filterMethods(status);
      }
    }
  }
reconnect(strDevice) {
    if(lockReconnect) {
      return;
    };
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    tt && clearTimeout(tt);
  tt = setTimeout(function () {
      this.createWebSocket(strDevice);
      lockReconnect = false;
    }, 8000);
  }
 
  
  componentWillUnmount() {
      ws=null;
      tt=null;
    
  }
  getStatus=async()=>{
    try {
    const device=await DeviceInfo.getUniqueId();
       const aiAbility=await getAiAbilityList();
       if(aiAbility){
        store.homeStore.SetAiAbility(aiAbility.data.data);
       }
      if(device){
        const obj= await deviceGetByCode(device);
        if(!obj.data.code){
         this.filterMethods(obj.data.data.serviceStatus);
        return device;
        }
        else{
          return 
        }
      }
    } catch (error) {
      console.log(error,'err');
    }
  }
filterMethods(val){
switch (val) {
  case 0:
    console.log('监控');
    this.navigator.dispatch(NavigationActions.navigate({
      routeName:"Monitoring",
    }));
    break;
    case 1:
      this.navigator.dispatch(NavigationActions.navigate({
        routeName:"ScreenProtect",
      }));
      console.log('服务');
    break;
    case 2:
      this.navigator.dispatch(NavigationActions.navigate({
        routeName:"WelcomePages",
      }));
      console.log('主动服务');
    break;
}

  }

  render() {
    return (
      <View>
      </View>
    );
  }
}

export default InitWs;
