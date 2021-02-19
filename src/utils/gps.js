import { init, Geolocation,setNeedAddress,setLocatingWithReGeocode } from "react-native-amap-geolocation";
import {PermissionsAndroid,Platform} from 'react-native';
import  {getKey} from "@/api/map";

export default async function(){
  // 对于 Android 需要自行根据需要申请权限
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
   const data=await getKey();
   console.log(data.data.data,'key');
   if(!data.data.code){
   await init({
      ios: "9bdaa4b75a48c787d0a5fbf22050673b",
      android:data.data.data,
    });
   }
  //  if(data)

  //地址逆编码
  // android
  // setNeedAddress(true);

  // ios
  if(Platform.OS == "ios"){
    setLocatingWithReGeocode(true);
  }

  // 使用自己申请的高德 App Key 进行初始化


  return await new Promise(function(resolve,reject){
    Geolocation.getCurrentPosition(resolve,reject);
  })
}