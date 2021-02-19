import { Face } from "react-native-camera/types";
import utils from "@/utils";

var debugflag = false
function debug() {
  try {
    if(!debugflag){
      return;    
    }
    console.debug(arguments)
  } catch (error) {
    console.error('log error', error)
  }
}
//计算偏移量返回
function calculatePosition({...partPosition}){
  // console.log(partPosition,'partPosition');
   //先判断,右脸颊是否出现，出现
 if(!partPosition.rightCheekPosition&&!partPosition.noseBasePosition)  return false;
  //判断鼻子
let nose=partPosition.noseBasePosition;
// console.log(nose,'nose鼻子');
// console.log(nose,'nose');
let Ispass=false;
let IsSkip=false;
 if(nose&&nose.x>220&&nose.x<340){
  // oldTime=new Date()
  // nose.y>400&&nose.y<530
   Ispass=true;
   if(nose.y>400&&nose.y<530){
    IsSkip=true;
     
   }
  }
  else if(nose&&(nose.x<220||nose.x>340)){
    Ispass=false;
    IsSkip=false;
  }
  return {Ispass,IsSkip};
}



export default function ({fn,width=utils.window.screenW,height=utils.window.screenH}){
  if(!fn)return null;
  var isRun = false;
  var detectTimes = 0;  //检测到的次数
  var lastFace = null;  //最后那张脸
  var lastTime = null;  //最后检测到的时间
 var faceObj={};
  // var Ispass=false;
  // var IsSkip=false;
  const continueMS = 1000;  //持续检测到这张脸多长时间才算检测成功

  return function(response: { faces: Face[] }){
    faceObj=calculatePosition(response.faces[0]);
    if (isRun)   return;
    let maxFace = null;
    let maxArea = 0;
    for (const face of response.faces) {
      let area = face.bounds.size.width*face.bounds.size.height;
      if(maxArea<area){
        if(face.bounds.size.width<width*0.1||face.bounds.size.height<height*0.1)continue;
        maxArea = area;
        maxFace = face;
      }
    }
    // console.log(showFace,'人脸第二步');
    if(!maxFace)return;
    debug('人脸检测', new Date(), '检测到人脸', maxFace);

    if (lastFace == null || maxFace.faceID != lastFace.faceID) { // 如果检测到的脸和上一张脸不同，则重置检测次数
      debug('人脸检测', '检测到新的人脸，次数重置', lastFace, maxFace);
      lastFace = maxFace;
      detectTimes = 0;
      lastTime = new Date();
    } 

    // detectTimes++;
    // console.log('人脸检测', '人脸', maxFace, '检测次数', detectTimes);
    // if(detectTimes < 3){ // 控制灵敏度，重复检查到3次，才算检查到
    //  return;
    //}

    var _continued = new Date().getTime() - lastTime.getTime();
    debug('人脸检测', '人脸', maxFace, '持续时间', _continued); 
    if(_continued < continueMS ){  // 控制灵敏度，持续三秒有检测到，才算检查到
      return;
    }
    debug('人脸检测', '检测成功，进入方法', maxFace, detectTimes)
    isRun = true;  // 标记检测到了脸，并执行对应方法，方法执行完后重置标记
    // let timeout=!showFace?1000:100;
    //  setTimeout(() => {
    fn.call(this,faceObj.Ispass,isRun,faceObj.IsSkip);
    isRun=false;
    lastFace = null;
    detectTimes = 0;
    lastTime = null;

        // .finally(()=>{
        //   isRun = false;
        //   //重置变量
        //   lastFace = null;
        //   detectTimes = 0;
        //   lastTime = null;
        //   debug('人脸检测', '方法执行完成，检测重置，进入方法', lastFace, detectTimes)
        // })
      // }, 1000);
    }
}