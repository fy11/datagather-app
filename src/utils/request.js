import axios from "axios";
import env from "./environment";
import store from "@/store"
import { NavigationActions ,StackActions} from "react-navigation";
import { getTransitioning,pushCallback,goBackUp } from "@/router"

const instance = axios.create({
  baseURL: env.BASEURL,
  timeout: 5000,
  headers: {}
});

//请求拦截处理
instance.interceptors.request.use(async function (config) {
  // 在发送请求之前做些什么
  config.headers.productId = store.homeStore.productId;
  try {
    config.headers["X-Token"] = await store.userStore.GetToken() || "";
  } catch (error) {
    
  }
  if(!config.headers.notLoadding)store.homeStore.lodding.showLoading();
  return config;
}, function (error) {
  // 对请求错误做些什么
  store.homeStore.lodding&&store.homeStore.lodding.dismissLoading();
  return Promise.reject(error);
});

//返回拦截处理
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  store.homeStore.lodding&&store.homeStore.lodding.dismissLoading();
  // console.log(response)
  return response;
}, function (error) {
  // 对响应错误做点什么
  store.homeStore.lodding&&store.homeStore.lodding.dismissLoading();
  if(error.response && error.response.status == 401){
    // var s = StackActions.reset({
    //   index: 0,
    //   actions: [NavigationActions.navigate({ routeName: 'SignInPage' })],
    // })
    // console.log(store.homeStore.router)
    
    if(!getTransitioning()){
      goBackUp();
    }else{
      pushCallback(()=>{
        goBackUp();
      })
    }
  }
  return Promise.reject(error);
});


export default instance;
