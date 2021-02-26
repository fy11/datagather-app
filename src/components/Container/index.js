import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Input, Button, Header } from "react-native-elements";
import store from "@/store"
import React, { useState, useEffect, useRef } from 'react'
export const Container = (props) => {
    const {headerSolt,contentSolt,footerSolt}=props
    const styles = StyleSheet.create({    
        main:{
            height:'100%',
            flex:1,
            paddingTop:56,
            paddingBottom:56,
            marginLeft:32,
            marginRight:32
        },
        header:{
          

        },
        content:{
        
        },
        footer:{

        },

    
    })

    // const [state, setState] = useState({
    //     selectedValue: '+86',
    //     phoneNumber: '',
    //     code: '',
    //     nationalName: '中国',
    //     loading: false,
    //     flag: false,
    // });
    // const [stm,setTime]=useState({
    //     yzTime:59

    // });
    // let modalRef = useRef(null);
    // let modalCodeRef=useRef(null);
    useEffect(() => {
        console.log(props,'props');
        // modalRef.current.focus();
        return () => {
        
            console.log('在组件 unmount 时触发')
          };
    },[])
 
   

  



    return (
        <View  style={styles.main}>
        <View style={styles.header}>
        {headerSolt()}       
        </View>
        <ScrollView  style={styles.content}> 
        {contentSolt()}  
        </ScrollView>
        <View style={styles.footer}>
        {footerSolt()}
        </View>
             
        </View>

    )
}
