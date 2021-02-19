import { useEffect, useCallback, useRef } from "react";
// import AudioRecord from "react-native-audio-record";
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import RNFetchBlob from "rn-fetch-blob";
import { Platform } from "react-native";

// function GlobalAudioRecord(){
//   const onData = useRef(null);
//   useEffect(()=>{
//     const options = {
//       sampleRate: 16000,  // default 44100
//       channels: 1,        // 1 or 2, default 1
//       bitsPerSample: 16,  // 8 or 16, default 16
//       audioSource: 6,     // android only (see below)
//       wavFile: 'test.wav' // default 'audio.wav'
//     };
    
//     AudioRecord.init(options);
//     AudioRecord.start();
//     var abuffer = new Buffer(0);
//     var time = moment();
//     onData.current = data => {
//       let d = Buffer.from(data, 'base64');
//       abuffer = Buffer.concat([abuffer,d]);
//       if(abuffer.byteLength > 100*1024 && store.homeStore.uniqueId){
//         RNFetchBlob.fetch("POST",env.BASEURL+"/soundRecording/always_upload",{
//           'Content-Type' : 'multipart/form-data',
//         },[
//           { name : 'file', filename : '1.pcm', data: abuffer.toString("base64")},
//           { name : 'deviceId', data : store.homeStore.uniqueId},
//           { name : 'startTime', data : time.format("yyyy-MM-dd HH:mm:ss")},
 
//         ])
//         abuffer = new Buffer(0);
//         time = moment();
//       }
//     }
//     AudioRecord.on('data', onData.current );
//     return ()=>{
//       AudioRecord.stop();
//     }
//   })
//   return null
// }

var _interval = {
  id:1000
}
function _setInterval(fn,time){
  var id = _interval.id ++;
  function _(){
    fn.apply(this,arguments)
    _interval[id] = setTimeout(_,time)
  }
  _interval[id] = setTimeout(_,time)
  return id;
}
function _clearInterval(id){
  _interval[id]&&clearTimeout(_interval[id])
}


var firstTime = 0;
var count = 0;
var timer = null;
var over = false
async function startRecord(){
  try {
    if(over)return;
    firstTime = new Date().getTime();
    let audioPath = AudioUtils.DocumentDirectoryPath + `/global_audio_record_${firstTime}_ing.aac`;
    await AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
    });
    if(over)return;
    await AudioRecorder.startRecording();
    AudioRecorder.onFinished = (data) => {
      if (Platform.OS === 'ios') {
        _finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
      }
    };
    timer&&_clearInterval(timer);
    count = 0;
    timer = _setInterval(stopRecord,60 *1000)
  } catch (error) {
    console.log(error)
    setTimeout(startRecord,30000)
  }
}
async function stopRecord(){
  if(++count < 3)return;
  count = 0;
  try {
    const filePath = await AudioRecorder.stopRecording();
    _finishRecording(true,filePath)
  } catch (error) {
    console.log(error)
    setTimeout(startRecord,30000)
  }
}
function _finishRecording(didSucceed, filePath, fileSize?){
  RNFetchBlob.fs.mv(filePath,filePath.replace("_ing","")).finally(()=>{
    startRecord();
  })
}
function GlobalAudioRecordMp3(){
  useEffect(()=>{
    over = false;
    startRecord();
    return async ()=>{
      timer&&_clearInterval(timer);
      over = true;
      const filePath = await AudioRecorder.stopRecording();
      _finishRecording(true,filePath)
    }
  },[])
  return null;
}


export default GlobalAudioRecordMp3;