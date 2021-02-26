import React from 'react';
import { View, StyleSheet,NativeEventEmitter,NativeModules } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Button, Text,ListItem} from "react-native-elements";
import  {Container}  from '@/components/Container'

import { _ENV_, _ORG_ } from '@/utils/environment';

class Collect extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.homeStore;
    this.BluetoothDevice=NativeModules.BluetoothDevice;
    this.eventEmitter = new NativeEventEmitter(this.BluetoothDevice);
    this.state = {
      collectList:
        [
          {
            name: '当前血压',
            value: 'Vice President1'
          },
          {
            name: '当前血氧',
            value: 'Vice President1'
          },
          {
            name: '当前心电',
            value: 'Vice President1'
          },
          {
            name: '设备信号',
            value: 'Vice President1'
          },
          {
            name: '数据状态',
            value: 'Vice President1'
          },  
      ],


    };
  }

  async componentDidMount() {
    try {
      this.BluetoothDevice&&this.BluetoothDevice.getData();
      this.eventEmitter.addListener('send_data', (event) => {
        console.log(event,'data')
        });  

      setTimeout(() => {
        this.props.navigation.replace('CollectComplete',{}); 
      }, 30000);
    } catch (error) {
      console.log(error, "error");
    }
  }

  handleItem=(item)=>{
    console.log(item,'item');
  }

  componentWillUnmount() {}

  render() {
    const headerSolt=()=>{
      return <Text style={styles.headerTitle}>采集中</Text>
    }
    const contentSolt=()=>{
     
  return (
    <View style={styles.content} >
  {
    this.state.collectList.map((v,index)=>(
    <View style={{position:'relative'}}>
        <ListItem
          key={index+'modalList'}
          topDivider
          title={v.name}
          containerStyle={styles.checkBoxSty}
          rightIcon={{ type: 'font-awesome', name: 'angle-right' ,}}
          onPress={()=>this.handleItem(v)}
             >     
            </ListItem>
        
            <Text style={{position:'absolute',right:30,top:10}}>
              {v.value}
            </Text>  
            </View>
       
          
             ))
   }
      
    </View>

  )
  
  
         
         
      
    }
    const footerSolt=()=>{
      return(
        <Text></Text>
      )
    }
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
  content:{
    marginTop:48,
    marginBottom:48,
  },
  checkBoxSty:{
    paddingBottom:8,
    paddingTop:8,
    paddingLeft:0,
    paddingRight:0
    // paddingLeft:32,
    // paddingRight:32,
    
  },
});
export default inject(["homeStore"])(observer(Collect));
