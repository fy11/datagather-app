import axios from "axios";

import xml2json from "@/utils/xml"

import { getOssConfig } from "@/api/chat";
import { parseTime } from "@/utils/time"

import RNFetchBlob from "rn-fetch-blob"

export default function (option) {
  var file = null,filename = "";

  if(option.file instanceof File || option.file instanceof Blob){
    file = option.file;
    filename = file.name || filename;
  }else{
    file = RNFetchBlob.wrap(option.file.uri);
    filename = option.file.name
  }
  
  return new Promise(function (resolve,reject){
    RNFetchBlob.fetch('POST', `${option.host}`.replace(/http(s+)\:/,"https:").replace("-internal","")+"/", {
      'Content-Type' : 'multipart/form-data',
    }, [
      { name : 'OSSAccessKeyId', data : option.accessKeyId},
      { name : 'policy', data : option.policy},
      { name : 'Signature', data : option.signature},
      { name : 'key', data : option.key,},
      { name : 'success_action_status', data : "201"},
      { name : 'file', filename : filename,  data: file},
    ]).then((res) => {
      if(res.respInfo.status != 201){
        reject(res.data);
        return ;
      }
      let text = res.data
      let xmlDoc = null;
      xmlDoc = xml2json(text)
      resolve(xmlDoc)
    })
    .catch(err=>{
      console.log(err)
      alert(JSON.stringify(err));
    })
  })

}


export function fileUploadByPath(path){
  var fileStat = null;
  return RNFetchBlob.fs.stat(path).then(res=>{
    fileStat = res;
    // console.log(res)
    return getOssConfig()
  }).then((result)=>{
    return RNFetchBlob.fetch('POST', `${result.data.host}`.replace(/http(s+)\:/,"https:").replace("-internal","")+"/", {
      'Content-Type' : 'multipart/form-data',
    }, [
      { name : 'OSSAccessKeyId', data : result.data.accessid},
      { name : 'policy', data : result.data.policy},
      { name : 'Signature', data : result.data.signature},
      { name : 'key', data : `${result.data.dir}${parseTime(new Date(),"{y}/{m}/{d}/{h}/{i}/{s}/")}${Math.floor(Math.random()*1000000)}/${fileStat.filename}`,},
      { name : 'success_action_status', data : "201"},
      { name : 'file', filename : fileStat.filename,  data: RNFetchBlob.wrap(path)},
    ])
  }).then(res=>{
    return new Promise(function (resolve,reject){
      if(res.respInfo.status != 201){
        reject(res.data);
        return ;
      }
      let text = res.data
      let xmlDoc = null;
      xmlDoc = xml2json(text)
      resolve(xmlDoc)
    });
  }).then((res)=>{
    let msgData = {
      url:res.Location,
      size: fileStat.size,
      type: "",
      name: fileStat.filename,
      // duration:this.vdata.currentTime
    }
    return msgData;
  }).catch(err=>{
    console.error(err,'err');
  })
}

export function fileUploadByBase64({base64,path = ""}){
  var key = path || `${parseTime(new Date(),"{y}/{m}/{d}/{h}/{i}/{s}/")}${Math.floor(Math.random()*1000000)}.jpg`
  return getOssConfig().then((result)=>{
    return RNFetchBlob.fetch('POST', `${result.data.host}`.replace(/http(s+)\:/,"https:").replace("-internal","")+"/", {
      'Content-Type' : 'multipart/form-data',
    }, [
      { name : 'OSSAccessKeyId', data : result.data.accessid},
      { name : 'policy', data : result.data.policy},
      { name : 'Signature', data : result.data.signature},
      { name : 'key', data : `${result.data.dir}${key}`,},
      { name : 'success_action_status', data : "201"},
      { name : 'file', filename : "1.jpg",  data: base64},
    ])
  }).then(res=>{
    return new Promise(function (resolve,reject){
      if(res.respInfo.status != 201){
        reject(res.data);
        return ;
      }
      let text = res.data
      let xmlDoc = null;
      xmlDoc = xml2json(text)
      resolve(xmlDoc)
    });
  }).then((res)=>{
    let msgData = {
      url:res.Location,
      size: 100,
      type: "",
      name: "1.jpg",
    }
    return msgData;
  }).catch(err=>{
    console.error(err,'err');
  })
}