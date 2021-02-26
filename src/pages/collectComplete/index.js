import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Button, Text, Overlay,Icon} from "react-native-elements";
import  {Container}  from '@/components/Container'
import { _ENV_, _ORG_ } from '@/utils/environment';

class CollectComplete extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.homeStore;
    this.state = {};
  }

  async componentDidMount() {
    try {
    } catch (error) {
      console.log(error, "error");
    }
  }

  handleAgain=()=>{
    this.props.navigation.replace('ScreenProtect',{});
  

  }

  componentWillUnmount() {}

  render() {
    const headerSolt=()=>{
  
        return (
        
        <View>
        <Icon
      name='check-circle'
      type='font-awesome'
      color='#07c160'
      iconStyle={{marginBottom:32}}
      size={64}
    />
<Text style={styles.headerTitle}>采集完成</Text>
        </View>
        )
    }
    const contentSolt=()=>{
      return(
          <View style={styles.content} >
       
        <Text style={styles.content_text}>您已采集完成,可重新采集</Text>
          </View>
      )
    }
    const footerSolt=()=>{
        return(
            <Button
            title="重新采集"
            titleStyle={styles.btnTitle}
            buttonStyle={ styles.btnSty}
            onPress={()=>this.handleAgain()}
          />
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
        marginTop:16
      },
      content_text:{
        textAlign:'center',
        fontSize:17,
        fontWeight:'400',
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
export default inject(["homeStore"])(observer(CollectComplete));
