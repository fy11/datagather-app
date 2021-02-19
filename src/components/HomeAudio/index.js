
// import Sound from "react-native-sound"
import store from "@/store";
import RNFetchBlob from "rn-fetch-blob"
//当点击或者自动加入的时候传入1.当前这条信息2.键值3.回调函数;
//当消息进入不存在这个key的话将其设为{},存在的话过滤掉那个key,重新生成;
//为不重复的key 绑定 动画状态(关闭开启),播放器(启动，暂停)，将状态通过回调函数返回出去;
//全局方法 结束播放结束动画，过滤url方法
//流程 进入方法-无key加入对象，有key清除重新绑定-为其过滤url-增加播放器(可控制播放，暂停。动画)

var Sound = require('react-native-sound');

const CacheAudio={
audioPlayList:[],
whoosh:null,
playIng:false,
//加入播放器
joinPlayer: async function (pop,key){
  const CACHE_ITEM=await cacheSound(pop);
  let playerObj={
    key,
    pop,
    sound:new Sound(CACHE_ITEM.path(), Sound.MAIN_BUNDLE,(error)=>{
    console.log(error,'error');
    }),

  };
  Sound.setCategory('Playback');
 if(this.audioPlayList.find(v=>v.key===key)){
  this.audioPlayList=this.audioPlayList.filter(i=>i.key===key);
 }
this.audioPlayList.push(playerObj);
 this.audioPlay(key,CACHE_ITEM)
},
//播放传递参数(pop,key,回调函数)
audioPlay:function(key,content){   
    let findKeyObj=this.audioPlayList.find(v=>v.key===key);
  if(!this.playIng&&this.audioPlayList.length>0&&!findKeyObj.sound._playing){
    //播放之前关闭全部正在播放  
    // this.audioPlayList.forEach(v=>stopAudio(v.sound));
    setTimeout(() => {
        findKeyObj.sound.play(()=>{
            this.playIng=false;
            })  
    }, 100);
    return this.playIng
  }
}

}
function stopAudio(sound){
  sound.stop();
  sound.release();

}
//缓存音频Url
function  cacheSound(pop){

    const CONTENT_ITEM =JSON.parse(pop.content);
    return new Promise((resolve, reject) => {
     RNFetchBlob.config({
        fileCache: true,
          })
          .fetch('GET', CONTENT_ITEM.url, {
          }).then(res => {
             resolve(res) 
        }).catch(error=>{
          console.log(error,'error');
        })
    })
    



}
// function  _audioPlay(...args){
//     let {pop,res}={args};
//     let playSounding;
//      let sound = new Sound(res.path(), null, (error) => {
//         if (error) {
//           console.log('failed to load the sound', error);
//           pop.playcb&&pop.playcb();
//           playSounding = false;
//           return ;
//         }
//         sound.playcb = pop.playcb;
//         if(!openAnimation){
//             setTimeout(() => {
//               store.homeStore.chatContentItem&& store.homeStore.chatContentItem.animation(true);
//             },100)
//           }
//         sound.play(()=>{
//           setTimeout(() => {
//       store.homeStore.chatContentItem&& store.homeStore.chatContentItem.updateStatu(false);       
//           }, 0); 
//         playSounding = false;
//           sound.stop();
//           sound.release();
//           res.flush();
//         //   this.playSound();
//           pop.playcb&&pop.playcb();
//         })
//       });
//         return {
//         playSounding,
//         sound
//         }

// }
export {
  CacheAudio
}