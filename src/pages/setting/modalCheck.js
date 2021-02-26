import { Overlay, Button,ListItem} from "react-native-elements";
import {ScrollView} from "react-native";
import  React,{ useState,forwardRef,useImperativeHandle} from "react";
import store from "@/store"


export let ModalCheck=forwardRef((props,ref)=>{
  const [state,setState] = useState({
    isVisible:false,
    list:[],
    sumbitValue:null,
    title:'',

  })  
  function _radioCheck(item){
    let mapArray=state.list;
    let sumbitValue;
    if(mapArray.find(i=>i.checked&&i.id!==item.id)){
      mapArray=state.list.map(item=>item.checked=false);
    } 
    item.checked=!item.checked;
    if( item.checked){
     sumbitValue=item
    }
    else{
     sumbitValue=''
    }
     setState({...state,list:state.list,sumbitValue})

  }




  const handleClickCheck=(item)=>{
      _radioCheck(item)
  
    }
    const handleClickConfirm=()=>{
        if(state.sumbitValue && 'section' in state.sumbitValue ){
            props.onChange&& props.onChange(state.sumbitValue,state.title);
        }
        else{
            props.onChange&& props.onChange()    
        }
        setState({ ...state,isVisible: false })
      }
  useImperativeHandle(ref, () => ({
    show: (data) => {
      console.log(data,'data_我被展示了');
      setState({...state,isVisible:true,list:data.list,title:data.title});
    },
    hide:()=>{
      // console.log()
      setState({ ...state,isVisible: false })
    },
  }));
  return (
    <Overlay
      isVisible={state.isVisible}
      windowBackgroundColor="rgba(0, 0, 0, .5)"
      overlayBackgroundColor="#fff"
      width="100%"
      height="100%"
    >
      <>
      <ScrollView >
      {state.list.map((v,index)=>(
       (
          <ListItem
          key={index+'modalList'}
          containerStyle={{margin:5,padding:5}}
          title={v.section}
          checkBox={{checked:v.checked,onPress:()=>{handleClickCheck(v)}}}
         />
        
       )))
      
  
      }
      </ScrollView>
          <Button
          title={'确定'}
          onPress={()=>handleClickConfirm()}
          buttonStyle={{backgroundColor: '#07c160'}}
          containerStyle={{paddingRight:10,paddingLeft:10}}
        />
      </>
    </Overlay>
  )
})
