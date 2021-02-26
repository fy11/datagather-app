import React,{createRef} from 'react';
import { View, StyleSheet,TouchableOpacity,NativeEventEmitter,NativeModules } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Button, Text, Input  } from "react-native-elements";
import  {Container}  from '@/components/Container'
import {ModalCheck} from "./modalCheck"
import { _ENV_, _ORG_ } from '@/utils/environment'
import Toast from 'react-native-root-toast';
 class SettingParameter extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.homeStore;
    this.BluetoothDevice=NativeModules.BluetoothDevice;
    this.eventEmitter = new NativeEventEmitter(this.BluetoothDevice);
    this.selectObj={
      smoothingList:[
        {
          id:0,
          section:'滤波全关',
          checked:false,
        },
          {
          id:7,
          section:'滤波全开',
          checked:false,
        },
          {
          id:1,
          section:'工频滤波',
          checked:false,
        },
          {
          id:2,
          section:'肌电滤波',
          checked:false,
        },
          {
          id:4,
          section:'基线滤波',
          checked:false,
        },
  
      ],
  
      gainList:[
        {
          id:'DISPLAY_GAIN_2_5',
          section:'2.5mm/mV',
          checked:false,
        },
        {
          id:'DISPLAY_GAIN_5',
          section:'5mm/mV',
          checked:false,
        },
        {
          id:'DISPLAY_GAIN_10',
          section:'10mm/mV',
          checked:false,
        },
        {
          id:'DISPLAY_GAIN_20',
          section:'25mm/mV',
          checked:false,
        },
        {
          id:'DISPLAY_GAIN_Limb10_Chest5',
          section:'肢导 10mm/mV,胸导5mm/mV',
          checked:false,
        },
        {
          id:'DISPLAY_GAIN_Limb20_Chest10',
          section:'肢导20mm/mV,胸导10mm/mV',
          checked:false,
        },
  
  
  
      ],
      walkingSpeedList:[
        {
          id:'DISPLAY_SPEED_5',
          section:'5mm/s',
          checked:false,
        },
        {
          id:'DISPLAY_SPEED_10',
          section:'10mm/s',
          checked:false,
        },
        {
          id:'DISPLAY_SPEED_125',
          section:'12.5mm/s',
          checked:false,
        },
        {
          id:'DISPLAY_SPEED_25',
          section:'25mm/s',
          checked:false,
        },
        {
          id:'DISPLAY_SPEED_50',
          section:'50mm/s',
          checked:false,
        },
  
  
      ],
      displayModeList:[
        {
          id:'DISPLAY_MODE_12x1',
          section:'12导1列显示',
          checked:false,
        },
          {
          id:'DISPLAY_MODE_6x2',
          section:'2列显示,每列6导',
          checked:false,
        },
  
      ],

    }
    
    this.state = {
      form:{
        gatherTime:null,
        bloodInterval:null,
        gain:null,
        walkingSpeed:null,
        smoothing:null,
        displayMode:null,
      },
    
    };
    this.ref= createRef();
  }
  async componentDidMount() {
    try {
    } catch (error) {
      console.log(error, "error");
    }
  }


  componentWillUnmount() {}
  handleGoCollect=(gatherTime,intervalTime)=>{
    if(!gatherTime) return '我没设置采集时间'
    if(!intervalTime) return '我没设置血压间隔'
    this.BluetoothDevice&& this.BluetoothDevice.setParamets({gatherTime:Number(gatherTime),intervalTime:Number(intervalTime)});
    
    setTimeout(() => {  
      this.props.navigation.replace('Collect',{});
    }, 500);
  

  }
  onChangeInputText = (val, text) => {
  this.state.form[text]=val.replace(/[^\d]+/, '');
  this.setState({
    form:this.state.form
  })
    // if (JSON.parse(item.attributeConf).type == 1) {
    //  


}
  handleSelect=(title,list)=>{
  
 this.ref.current.show({title,list})
    // 
  }

  radioChange=(item,text)=>{
    if(!item) return;
    this.state.form[text]=item.section;
      this.setState({
        form:this.state.form
      })
    console.log('我获得了值',item)


  }
  render() {
    const form=this.state.form;
    const selectObj=this.selectObj;
    const headerSolt=()=>{
        return <Text style={styles.headerTitle}>设置参数</Text>  
      };
    const contentSolt=()=>{
      return (
     <View style={styles.content_body}> 

    <View style={styles.content}>
    <Text style={styles.it_label}>
      采集时长 
    </Text>
    <Input
    value={form.gatherTime}
    keyboardType={'numeric'}
    inputContainerStyle={{borderBottomWidth:0}}
    placeholder='单位小时'
    onChangeText={val => { this.onChangeInputText(val,'gatherTime') }}
    />
    </View>

    <View style={styles.content}>
    <Text style={styles.it_label}>
      血压间隔  
    </Text>
    <Input
    value={form.bloodInterval}
    keyboardType={'numeric'}
    inputContainerStyle={{borderBottomWidth:0}}
    onChangeText={val => { this.onChangeInputText(val,'bloodInterval') }}

    placeholder='单位分钟'
    />
    </View>
    {/* <TouchableOpacity onPress={()=>this.handleSelect('gain',selectObj.gainList)}>
    
    <View   style={styles.content}>
    <Text style={styles.it_label}>
    增益 
    </Text>
    <Input
    inputContainerStyle={{borderBottomWidth:0}}
    value={form.gain}
    editable={false}
    rightIcon={{ type: 'font-awesome', name: 'angle-right' ,}}
    rightIconContainerStyle={styles.it_icon}
    placeholder='预设内容'
    />
    </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>this.handleSelect('walkingSpeed',selectObj.walkingSpeedList)}>
    <View  style={styles.content}>
    <Text style={styles.it_label}>
    走速 
    </Text>
    <Input
     rightIcon={{ type: 'font-awesome', name: 'angle-right' ,}}
    rightIconContainerStyle={styles.it_icon}
    value={form.walkingSpeed}
    editable={false}
    inputContainerStyle={{borderBottomWidth:0}}
    placeholder='走速'
    />
    </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>this.handleSelect('smoothing',selectObj.smoothingList)}>
    <View  style={styles.content}>
    <Text style={styles.it_label}>
    滤波 
    </Text>
    <Input
    inputContainerStyle={{borderBottomWidth:0}}
    value={form.smoothing}
    rightIcon={{ type: 'font-awesome', name: 'angle-right' ,}}
    rightIconContainerStyle={styles.it_icon}
    editable={false}
    placeholder='滤波'
    />
    </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>this.handleSelect('displayMode',selectObj.displayModeList)}>
    <View  style={styles.content}>
    <Text style={styles.it_label}>
    显示模式 
    </Text>
    <Input
    inputContainerStyle={{borderBottomWidth:0}}
    editable={false}
    value={form.displayMode}
    rightIcon={{ type: 'font-awesome', name: 'angle-right'}}
    rightIconContainerStyle={styles.it_icon,{right:80}}
    placeholder='显示模式'
    />
    </View>
    </TouchableOpacity> */}

<ModalCheck   onChange={(item,text)=>{this.radioChange(item,text)} }  ref={this.ref}/>

</View>
)


      
    };
    const footerSolt=()=>{
        return(
          <Button
          title="开始"
          titleStyle={styles.btnTitle}
          buttonStyle={styles.btnSty}
          onPress={()=>this.handleGoCollect(form.gatherTime,form.bloodInterval)}
        />
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
    content:{
        borderColor:'rgba(0,0,0,0.1)',
        paddingBottom:8,
        paddingTop:8,
        borderTopWidth:1,
        flexDirection: "row",
        marginBottom:5,
        position:'relative'
    },
    headerTitle:{
      textAlign:'center',
      fontSize:22,
      fontWeight:'700',
      paddingLeft:16,
      paddingRight:16,
    },
    it_label:{
        lineHeight:48,
        height:48,
        color:'rgba(0,0,0,0.9)',
        fontSize:17,
        marginRight:8,
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
    },
    content_body:{
      marginBottom:48,
      marginTop:48
    },
    it_icon:{
        position:'absolute',
        right:40,
        bottom:0,
    }
});
export default inject(["homeStore"])(observer(SettingParameter));
