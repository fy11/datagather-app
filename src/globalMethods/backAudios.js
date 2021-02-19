import Sound from 'react-native-sound';

export  function playAudio(url){
  let sound;
  try {
   sound=new Sound(url, null, (error) => {

  if (error) {
     console.log("播放失败");
    return false
     // reslove();
   }



  });
  playSound=function(){
    setTimeout(() => {
     sound&&sound.play(()=>
     {
       console.log('播放成功');
     })
    }, 100);
  }
   stopSound=function(){
     sound&&sound.stop()
     sound&&sound.release()
   }
  // return sound;    
  return {
    playSound:playSound,
    stopSound:stopSound,
  }
} catch (error) {
    console.log(error,'err');
    
  }



}