import React from 'react';
import { View, StyleSheet,PermissionsAndroid,NativeEventEmitter,NativeModules} from 'react-native';
import { observer, inject } from 'mobx-react';
import Toast from 'react-native-root-toast';
import { Button, Text, CheckBox,ListItem} from "react-native-elements";
import  {Container}  from '@/components/Container'
import { _ENV_, _ORG_ } from '@/utils/environment';


export default class ScreenProtect extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.homeStore;
    this.BluetoothDevice=NativeModules.BluetoothDevice;
    this.eventEmitter = new NativeEventEmitter(this.BluetoothDevice);
    this.listenerConnect=null;
   
    this.state = {
      bluetoothList:null,
      sendValue:null,
      headerTitle:'正在扫描'
    };
  }
  componentWillMount(){

  }
  async componentDidMount() {
    try {
        await PermissionsAndroid.requestMultiple([
'android.permission.ACCESS_FINE_LOCATION',
'android.permission.ACCESS_COARSE_LOCATION',
'android.permission.WAKE_LOCK',
'android.permission.WRITE_EXTERNAL_STORAGE',
'android.permission.ACCESS_NETWORK_STATE',
'android.permission.READ_PHONE_STATE',
'android.permission.READ_EXTERNAL_STORAGE',     
   ]);
        let bluetoothList=[];
        this.BluetoothDevice&&this.BluetoothDevice.startSearch();   
    this.eventEmitter.addListener('blue_device_data', (event) => {
      console.log(event,'data')
      const parseEvent=JSON.parse(event);
      bluetoothList.push(parseEvent);
      });
    
    this.eventEmitter.addListener('search_finsh', (event) => { 
    if(event==='success'){
      console.log('success data');
      this.setState({
        headerTitle:'扫描完成'
      }) 
    
      
      if(bluetoothList.length>0){
        this.setState({
          bluetoothList,
          headerTitle:'连接设备'
        }) 
      }
     
    }
  });

   

      


    } catch (error) {
      console.log(error, "error");
    }
  }
  componentWillUnmount() {
    this.BluetoothDevice&&this.BluetoothDevice.stopSearch();  

  }

  handleGoSetting=async ()=>{
     
      const sendValue=this.state.sendValue;
      const toastObj={
        'error':'连接失败',
        'success':'连接成功',
        'interrupt':'异常断开',
        'start':'开始连接',

      }
      if(!sendValue) return;
      this.BluetoothDevice&&this.BluetoothDevice.setConnection(sendValue.address);
      this.listenerConnect=this.eventEmitter.addListener('blue_connection_state', (event) => {
        Toast.show(toastObj[event], {position: Toast.positions.CENTER});
        console.log(event,'设备状态');
        if(event!=='start'){
          Toast.show(toastObj[event], {position: Toast.positions.CENTER});
          this.listenerConnect&&this.listenerConnect.remove();
          this.listenerConnect=null;
          this.props.navigation.replace('SettingParameter',{});
        }
      });

    } 
  
 

  

  

  handleGetBlue=()=>{
    
    console.log('执行扫描  BluetoothDevice');
    this.setState({
      headerTitle:'正在扫描'
    })
    this.BluetoothDevice&&this.BluetoothDevice.startSearch();
  }
  handleClickCheck=(item)=>{
    let mapArray=this.state.bluetoothList;
    let sendValue;
    if(mapArray.find(i=>i.checked&&i.mac!==item.mac)){
      mapArray=mapArray.map(item=>item.checked=false);
    } 
    item.checked=!item.checked;
    if( item.checked){
      sendValue=item
    }
    else{
      sendValue=''
    }
   this.setState({list:mapArray,sendValue})

  }
  render() {
 
    const headerSolt=()=>{
      
      return <Text style={styles.headerTitle}>{this.state.headerTitle}</Text>
    
    };
    const contentSolt=()=>{
      if(!this.state.bluetoothList){
        return (
          <View style={styles.content_not} >
            <Text style={styles.content_text}>暂未搜索到可用设备,可重新搜索</Text>
          </View>
        )

      }
      return(
      <View style={styles.content_find}>
   { this.state.bluetoothList.map((v, i) => {   
       return  <ListItem
       key={i+'ChatcheckBox'}
       containerStyle={styles.checkBoxSty}
       title={v.name}
       checkBox={{checked:v.checked,onPress:()=>{this.handleClickCheck(v)}}}
      />
          }
          )}
        
      </View>
   )
    };
    const footerSolt=()=>{
      if(!this.state.bluetoothList){
        return <Button
        title="重新搜索"
        titleStyle={styles.btnTitle}
        buttonStyle={ styles.btnSty}
        onPress={()=>this.handleGetBlue()}
      />
      }
      return(
        <View>
        <Button
        title="连接"
        titleStyle={styles.btnTitle}
        buttonStyle={styles.btnSty}
        onPress={()=>this.handleGoSetting()}
      />

      </View>
      )
    };
    return (
     <Container
      headerSolt={headerSolt}
      contentSolt={contentSolt}
      footerSolt={footerSolt}
     />
    )
 
  }
}

const styles = StyleSheet.create({

  headerTitle:{
    textAlign:'center',
    fontSize:22,
    fontWeight:'700',
    paddingLeft:16,
    paddingRight:16,
  },
  content_not:{
    marginTop:16

  
  },
  content_find:{
    marginTop:48,
    marginBottom:48,
  },
  checkBoxSty:{
    paddingBottom:8,
    paddingTop:8,
  },
  content_text:{
    textAlign:'center',
    fontSize:17,
    color:'rgba(0,0,0,0.9)'
  },
  btnSty:{
    backgroundColor:'#07c160',
    width:184,
    marginLeft:'auto',
    marginRight:'auto',

  },
  btnTitle:{
    fontWeight:'700',
    fontSize: 17,
  }
  
});
// export default inject(["homeStore"])(observer(ScreenProtect));
