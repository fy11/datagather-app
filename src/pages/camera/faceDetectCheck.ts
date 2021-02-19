import { Face } from "react-native-camera/types";
import utils from "@/utils";


//计算偏移量返回
function calculatePosition({...partPosition}){
 if(!partPosition.rightCheekPosition&&!partPosition.noseBasePosition)  return false;
  //判断鼻子
let nose=partPosition.noseBasePosition;
let Ispass=false;
let IsSkip=false;
 if(nose&&nose.x>220&&nose.x<340){
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
  var faceObj={};
  const continueMS = 500;  //持续检测到这张脸多长时间才算检测成功
  var lastTime = null;  //最后检测到的时间

  return function(response: { faces: Face[] }){
    if(isRun)return;
    faceObj=calculatePosition(response.faces[0]);
    let maxFace = null;
    let maxArea = 0;
    for (const face of response.faces) {
      let area = face.bounds.size.width*face.bounds.size.height;
      if(maxArea<area){
        if(face.bounds.size.width<width*0.2||face.bounds.size.height<height*0.2)continue;
        maxArea = area;
        maxFace = face;
      }
    }
    if(!maxFace)return;

    if (lastTime == null) { // 如果检测到的脸和上一张脸不同，则重置检测次数
      lastTime = new Date();
    }
    var _continued = new Date().getTime() - lastTime.getTime();
    if(_continued < continueMS ){
      return;
    }
    console.log('IsSkip',faceObj);
  if (!faceObj.IsSkip) return;
    //找出最大脸
    isRun = true;
    fn().finally(res=>{
      isRun = false;
      lastTime = null;
      
      console.log('人脸检测', '方法执行完成，检测重置')
    })
    // alert(`检测到人脸 bounds:${JSON.stringify(maxFace.bounds)}`)
  }

}