import React from "react";
import { View ,StyleSheet,Text} from "react-native";
import { Button} from 'react-native-elements';
// import HdIdcard  from "react-native-hdxxx";
import RNPrint from 'react-native-print';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

 export default class TestHd extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
        discernSuccess:false,
        authTypeList:[],
        current:0,
    }

  };
  componentDidMount() {
      // console.log(HdIdcard.show());

  }
  componentWillUnmount(){
  }
  
 
  
  render(){
    
      return(
    <View style={styles.container}>
   <Button containerStyle={{width:'95%',paddingBottom:20}} title={"打印pdf"} onPress={()=>{
             RNPrint.print({ filePath: 'https://hzhj.oss-cn-beijing.aliyuncs.com/file/7%E7%9A%84%E5%89%AF%E6%9C%AC6.pdf' })
      }}/>
    <Button containerStyle={{width:'95%'}} title={"打印其他"} onPress={()=>{
            RNPrint.print({ filePath: 'https://graduateland.com/api/v2/users/jesper/cv' })
    }}/>
   
    </View> 
    
     )
  }
}

