import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  MediaStreamConstraints
} from "react-native-webrtc";
import { observable ,keys} from "mobx";
import store from "@/store";
import env,{ Constant ,Config } from "@/utils/environment";
import TRTC,{RTCVIew} from "react-native-trtc"
import * as chatApi from "@/api/chat"
import RNFetchBlob from "rn-fetch-blob"
import Toast from "react-native-root-toast";
import eventbus from "@/components/eventbus";
import * as Sentry from "@sentry/react-native";
// import InCallManager from 'react-native-incall-manager';

var socketId = "112233";
var rtcpcList = {};
var offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};
var constraints: MediaStreamConstraints = {
  video: {
    mandatory: {
      minWidth: 240,
      minHeight: 320,
      minFrameRate: 30
    },
    facingMode: "user",
    optional: []
  },
  audio: true
};


function sentrylog(tag: string, ...args: string[]) {
  try {
    
    if(args && args.length > 0){
      console.log(tag, args.join(' , '))
    }else{
      console.log(tag)
    }
   
    // alert('[SENTRY_WEBRTC] ' + tag + ' , ' + args.join(' , '))
    Sentry.captureMessage('[SENTRY_WEBRTC] ' + tag + ' , ' + args.join(' , '))

  } catch (error) {
    console.log('sentrylog error', error)
  }
}


// constraints.video = false;
var stream:MediaStream = null;
var socket:WebSocket = null;
var candidateMap = {};
var wsUrl = env.BASEURL.replace("http","ws")+'/ws';

var lockReconnect = false;
var props = null;

var reconnectCheck = null;

function websocketReconnect() {
  sentrylog('执行重连')

  if (lockReconnect) {       // 是否已经执行重连
		return;
	};
	lockReconnect = true;
	//没连接上会一直重连，设置延迟避免请求过多
	tt && clearTimeout(tt);
	var tt = setTimeout(function () {
    lockReconnect = false;
    createWebSocket();
  }, 1000);
  

  //检查重连是否成功，如果不成功一直重连
  var checkTimes = 0;
  reconnectCheck && clearInterval(reconnectCheck)
  reconnectCheck = setInterval(function(){
    if (socket) {
      if(socket.readyState == 0 || socket.readyState == 3){
        checkTimes++;
      }
      if (checkTimes >= 6) {
        reconnectCheck && clearInterval(reconnectCheck)
        websocketReconnect();
      }
    }
  }, 1000)
}

async function createWebSocket(){
	try {
    socket = new WebSocket(wsUrl);
		await websocketInit();
	} catch (e) {
    console.log('catch',e);
		websocketReconnect();
	}
}

var headTimer = null
async function websocketInit(){
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", function(event) {
      sentrylog("webrtc websocket open", JSON.stringify(event))

      reconnectCheck && clearInterval(reconnectCheck)
      headTimer&&clearInterval(headTimer)
      headTimer = setInterval(() => {
        try {
          if(socket.readyState == 2 || socket.readyState == 3)return ;
          socket.send(JSON.stringify({ method: "Heartbeat", data:{
            videoing:Object.keys(streams).length>0,
            code:store.homeStore.uniqueId,
            sessionId:store.homeStore.chat.store.chatSessionId
          } }));
        } catch (error) {
          
        }
      }, 5000);
      console.log('webrtc websocket send init to server')
      socket.send(JSON.stringify({
        method:"init",
        data:{
          sessionId:props.sessionId,
          id:-props.customerId,
          deviceCode:store.homeStore.uniqueId,
          productId:store.homeStore.productId
          // type:0 // 0 app 1 工作台
        },
        from : -props.customerId,
        to : props.sessionId
      }))
      socketId = -props.customerId
      resolve();
    });
  });
  
  socket.addEventListener("error",function(event){
    sentrylog("webrtc websocket error", JSON.stringify(event))

    websocketReconnect();
  })
  socket.addEventListener("close", function (event){
    
    sentrylog("webrtc websocket close", JSON.stringify(event))

    websocketReconnect();
  })
  socket.addEventListener("message", async function(event) {
    
    sentrylog("webrtc websocket onmessage", event.data)

    var json:{
      method?:string, //消息类型 
      from?:string    //发送人,这里指客服 
      to?: string     //接受人,这里指客户 
      data?:any       //消息体
    } = {};

    try {
      json = JSON.parse(event.data);
    } catch (error) {
      sentrylog('websocket message parse error', event.data)
      return;
    }
    try {
      var data = json.data;
      if(json.method=='moneyIncome'){
        //将值存起来并且每次相加
        console.log(json,'获取到的钱');
        eventbus.emit("getMoney",json.data.money);
        store.homeStore.getMoney(json.data.money);
      }
      if(Config.TRTC){
        if(json.method == "offer"){
          chatApi.getUserSig({
            userId:"APP"+'_0_'+props.customerId
          }).then(async res=>{

            
            /** 关闭按住说话 */
            props.self.refs._audioModal.setDisabled(true)
            props.self.refs._audioModal.stop();
            props.self.vdata.recordTouch=0;
            setTimeout(function(){ //防止按住不释放重复触发start的问题
              console.log('delay close recorder')
              props.self.vdata.recordTouch=0;
            },200);


            /** 进入房间，打开视频框 */
            // props.self.vdata.keyboardType=0;
            store.homeStore.showVideo = json.data.isGlobal || false;
            _lastJoin.a = {
              sdkAppId:res.data.data.appid,
              // streamId:props.sessionId+'_APP_'+'0_'+props.customerId,
              userId:"APP"+'_0_'+props.customerId,
              userSig:res.data.data.usersig,
              roomId:props.sessionId,
              role:20
            };
            _lastJoin.b = 0;
            await eventbus.emit("beforeStartTRTC")

            console.log('TRTC joinChannel..')
            await TRTC.joinChannel({
              sdkAppId:res.data.data.appid,
              userId:"APP"+'_0_'+props.customerId,
              // streamId:props.sessionId+'_APP_'+'0_'+props.customerId,
              userSig:res.data.data.usersig,
              roomId:props.sessionId,
              role:20
            },0)
            
            /** 服务录音 */
            if(store.homeStore.aiAbility['fuwuluyin']){
              var fs = RNFetchBlob.fs;
              var savePath = fs.dirs.DownloadDir + "/recordA";
              fs.exists(savePath).then(res=>{
                if(res)return Promise.resolve();
                return fs.mkdir(savePath)
              })
              .finally(()=>{
                TRTC.startAudioRecording(savePath+`/${props.customerId}-${props.sessionId}-${new Date().getTime()}.aac`).then((res)=>{
                  console.log(res,"record ret")
                })
              })
            }
          })
        }
        if(json.method == "checkInState"){
          eventbus.emit("getCheckInNum",json.data.checkInNum);  
        }
        /** 坐席忙 */
        // if(json.method == "error"){
        //   Toast.show(json.msg,{
        //     duration: 3000,
        //     position: 50,
        //   })
        // }
        return;
      }
  

      if (json.method == "candidate") {
        var rtcIceCandidate = new RTCIceCandidate({
          candidate: data.candidate,
          sdpMLineIndex: data.sdpMLineIndex,
          sdpMid:data.sdpMid
        });
        // console.log(data)
        var peerConn = await getRTCPCInstance(json.from);
        peerConn.addIceCandidate(rtcIceCandidate);
      }
      if (json.method == "answer") {
        var rtcDescription = {
          type: "answer",
          sdp: data.sdp
        };
        var peerConn = await getRTCPCInstance(json.from);
        peerConn.setRemoteDescription(
          new RTCSessionDescription(rtcDescription)
        );
      }
      if (json.method == "offer") {
        var rtcDescription = {
          type: "offer",
          sdp: data.sdp
        };
        if(store.homeStore.chat.vdata.recordTouch == 1){
          await store.homeStore.chat.recorderStop();
        }
        var peerConn = await getRTCPCInstance(json.from);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await peerConn.setRemoteDescription(
          new RTCSessionDescription(rtcDescription)
        );
        var answer = await peerConn.createAnswer(offerOptions);
        peerConn.setLocalDescription(answer);

        var to = json.from;
        var json = {};
        json.method = "answer";
        json.data = {
          sdp: answer.sdp
        };
        json.from = socketId;
        json.to = to;
        socket.send(JSON.stringify(json));
        if(candidateMap[to]){
          candidateMap[to].forEach(v=>{
            socket.send(v)
          })
        }
        candidateMap[to] = false;
      }
      if (json.method == "create") {
        socketId = data.id;
        data.outerMembers.forEach(id => {
          InitCaller(id);
        });
      }
      if (json.method == "join") {
        // 创建rtcPeer实例
        getRTCPCInstance(json.from);
      }
      if (json.method == "exit") {
        onRemoveStream(rtcpcList[json.from], json.from, null);
      }
      if(json.method == "initOK"){
      
      }
    } catch (error) {
      sentrylog('websocket message handle error', error)
      return;
    }
  });
}


async function getUserMedia(p) {


  try {
    // InCallManager.start({media: 'audio'});
    // InCallManager.setKeepScreenOn(true);
    // InCallManager.setForceSpeakerphoneOn(true);
    let sourceInfos = await mediaDevices.enumerateDevices();
    
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (sourceInfo.kind == "videoinput" && sourceInfo.facing == "front") {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    constraints.video &&
      (constraints.video.optional = videoSourceId
        ? [{ sourceId: videoSourceId }]
        : []);

    stream = await mediaDevices.getUserMedia(constraints);
    
    

    props = p;
    await createWebSocket();
  } catch (error) {
    console.error(error);
  }
  // console.log(stream);
  // streams[0] = stream;


}

// var video = document.querySelector("video");
// video.srcObject = stream;

function getRTCPCInstance(id) {
  if (rtcpcList[id]) {
    return Promise.resolve(rtcpcList[id]);
  }
  const peerConn = new RTCPeerConnection({
    iceServers: [
      {
        url: `turn:${Constant.natIp}:${Constant.natPort}`,
        username: Constant.natName,
        credential: Constant.natPass
      },
      {
        url: `stun:${Constant.natIp}:${Constant.natPort}`
      }
    ],
    iceTransportPolicy: "relay"
  });
  peerConn.onicecandidate = e => onIceCandidate(peerConn, id, e);
  peerConn.onaddstream = e => onTrack(peerConn, id, e);
  // peerConn.ontrack = e => onTrack(peerConn, id, e);
  peerConn.onremovestream = () => onRemoveStream(peerConn, id, null);
  // peerConn.onremovestream = e => onRemoveStream(peerConn, id, e);
  peerConn.oniceconnectionstatechange = e => console.log(e);

  rtcpcList[id] = peerConn;
  if (stream != null) {
    //peer设置本地流
    peerConn.addStream(stream);
    // stream.getTracks().forEach(function(track) {
    //   peerConn.addTrack(track, stream);
    // });
  }
  return Promise.resolve(peerConn);
}

//初始化发送方
async function InitCaller(id) {
  var peerConn = await getRTCPCInstance(id);

  var offer = await peerConn.createOffer(offerOptions);
  peerConn.setLocalDescription(offer);
  var json = {};
  json.method = "offer";
  json.from = socketId;
  json.to = id;
  json.data = {
    sdp: offer.sdp
  };
  socket.send(JSON.stringify(json));
}
var streams = observable({});
function onTrack(pc, id, event) {
  console.log("onTrack", id);
  streams[id] = event.stream.toURL();
}

function onIceCandidate(peerConn, id, e) {
  console.log(peerConn, socketId, e);
  var json = {};
  json.method = "candidate";
  json.from = socketId;
  json.to = id;
  if (!e.candidate) return;
  json.data = {
    candidate: e.candidate.candidate,
    sdpMLineIndex: e.candidate.sdpMLineIndex,
    sdpMid:e.candidate.sdpMid
  };
  if(candidateMap[id] == false){
    socket.send(JSON.stringify(json));
    return 
  }
  !candidateMap[id]&&(candidateMap[id] = []);
  candidateMap[id].push(JSON.stringify(json));
  // socket.send(JSON.stringify(json));
}
function onRemoveStream(pc, id, e) {
  pc&&pc.close();
  delete rtcpcList[id];
  pc = null;

  delete streams[id];
  // document.getElementById(id) &&
  // document.body.removeChild(document.getElementById(id));
}

function release(){
  //打开按住说话录音
  props.self.refs._audioModal.setDisabled(false);
  Object.values(rtcpcList).forEach((v:RTCPeerConnection)=>{
    v.close();
  })
  stream&&stream.release();
  headTimer&&clearInterval(headTimer)
}
function localPause(){
  // stream.getTracks().forEach((t) => {
  //   stream.removeTrack(t);
  // });
  stream.getTracks().forEach((t) => {
    t.enabled = false;
  });
  // stream.release();
}
async function localPlay(){
  // stream = await mediaDevices.getUserMedia(constraints);
  // for (const key in rtcpcList) {
  //   if (rtcpcList.hasOwnProperty(key)) {
  //     rtcpcList[key].addStream(stream)
  //   }
  // }
  stream.getTracks().forEach((t) => {
    t.enabled = true;
  });
}
function clear(){

}

async function localCameraPause(){
  stream.getVideoTracks().forEach((t) => {
    t.enabled = false;
  });
}
async function localCameraPlay(){
  stream.getVideoTracks().forEach((t) => {
    t.enabled = true;
  });
}
var sleep = function(n=3000){
  return new Promise(resolve=>{setTimeout(resolve,n)})
}

var _lastJoin = {};
var _reonnectTimer = 0;
if(Config.TRTC){
  TRTC.initEngine()
  // sessionId={this.store.chatSessionId} customerId={this.store.customerId}
  getUserMedia = async function(p){

    props = p;
    await createWebSocket();

  }
  clear= async function(){
    localPause();
    TRTC.leaveChannel();
    console.log('TRTC release');
    headTimer&&clearInterval(headTimer);
    keys(streams).forEach(key=>{
      delete streams[key];
    })
    await eventbus.emit("beforeStopTRTC")
  }
  release = async function (){
    localPause();
    TRTC.leaveChannel();
    console.log('TRTC release');
    headTimer&&clearInterval(headTimer)
    lockReconnect = true;
    socket.close();
    keys(streams).forEach(key=>{
      delete streams[key];
    })
    setTimeout(()=>{
      lockReconnect= false;
    },1000)
    await eventbus.emit("beforeStopTRTC")
    
  }
  localPause = function(){
    TRTC.stopLocalPreview();
    TRTC.stopLocalAudio();
  }
  localPlay = function(){ //不要调用，会导致本地画面出不来
    TRTC.startLocalPreview();
    TRTC.startLocalAudio();
  }
  localCameraPause = async function(){
    TRTC.stopLocalPreview();
    // await sleep(2000);
    // TRTC.startScreenRecord();
  }
  localCameraPlay = async function(){
    // await TRTC.stopScreenRecord();
    // await sleep(1000);
    TRTC.startLocalPreview();
  }
  TRTC.addListener("onError",(e)=>{
    
    sentrylog('webrtc trtc onerror', JSON.stringify(e))

    if(e.errorCode == -1302){
      Toast.show("打开麦克风失败，禁用后重新启用设备，或者重启机器，或者更新配置程序",{
        duration:3000,
        position:Toast.positions.TOP,
      })
      return;
    }
    Toast.show("发送不可逆转的错误 将在3秒后重连",{
      duration:3000,
      position:Toast.positions.CENTER,
    })
    _reonnectTimer&&clearTimeout(_reonnectTimer);
    _reonnectTimer = setTimeout(async ()=>{
      try {
        await TRTC.leaveChannel();
        await TRTC.joinChannel(_lastJoin.a,_lastJoin.b)
      } catch (error) {
        console.error("重新加入会话 失败",error)
      }
    },3000)
  })
  TRTC.addListener("onEnterRoom",(e)=>{
    sentrylog('webrtc trtc onEnterRoom', JSON.stringify(e));
    TRTC.startLocalAudio();
    // localPlay()
  })
  TRTC.addListener("onUserExit",(e)=>{
    sentrylog('webrtc trtc onUserExit', JSON.stringify(e))
    // this.state.remoteListVideo.delete(e.userId)
    // this.forceUpdate();
    delete streams[e.userId];
    if (Object.keys(streams).length == 0) {
      TRTC.leaveChannel();
    }
  })
  TRTC.addListener("onUserEnter",(e)=>{
    sentrylog('webrtc trtc onUserEnter', JSON.stringify(e))
    // this.state.remoteListVideo.add(e.userId)
    // this.forceUpdate();
    streams[e.userId] = true;
  })
  TRTC.addListener("onError",(e)=>{
    sentrylog('webrtc trtc onError', JSON.stringify(e))
  })
  TRTC.addListener("onWarning",(e)=>{
    sentrylog('webrtc trtc onWarning', JSON.stringify(e))
  })
  
}




export { 
  streams,      //房间里的所有人
  stream,       //我的流
  getUserMedia, //启动
  release,      //关闭
  clear,
  localPause,   //暂停
  localPlay,    //播放
  localCameraPause, //视频暂停
  localCameraPlay   //视频播放
};
