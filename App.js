import Router,{onNavigationStateChange} from '@/router/index.js';
import React from "react";
import { SafeAreaView, View, StatusBar } from "react-native"
import { Provider, observer } from "mobx-react";
import env,{ Config} from "@/utils/environment";
// import env from "@/utils/environment";
import store from "@/store";
import MyLoading from "@/components/Loading";
// import GlobalTimerUpload from "@/components/uploadTimer"
// import GlobalOptimizeCheck from "@/components/optimizeCheck"
import eventbus from '@/components/eventbus';
import { observable } from 'mobx';

// var  ws=new webSocket()
@observer
export default class Root extends React.Component {
  constructor(props){
    super(props)

  }
  async componentDidMount(){

  }
  render() { 
    return (
      <Provider {...store}>
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
        <Router 
          style={{}}  
          ref={(ref)=>{
            this.navigator = ref;
            store.homeStore.initRouter(ref);
          }}
          onNavigationStateChange={onNavigationStateChange}
        />

          <MyLoading ref={(ref) => { store.homeStore.initLoading(ref)}} />    
          {/* 定时上传 */}
          {/* <GlobalTimerUpload /> */}
        </SafeAreaView>
      </Provider>
    );
  }
}
