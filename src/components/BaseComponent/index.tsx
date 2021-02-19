import React from "react"
import { copyStaticProperties, IReactComponent } from "@/utils";
import * as _webrtc from "@/pages/webrtc/webrtc"
export default function BaseComponent<T extends IReactComponent>(WrappedComponent: T): T {
    // Support forward refs
    let Injector = React.forwardRef((props, ref) => {
      const newProps = { ...props };

      if (ref) {
        newProps.ref = ref;
      }
      if (newProps["m-if"] === true || newProps["m-if"] === undefined)
        return React.createElement(WrappedComponent, newProps);
      return null;
    });
  
    // Static fields from component should be visible on the generated Injector
    copyStaticProperties(WrappedComponent, Injector);
    Injector.wrappedComponent = WrappedComponent;
    Injector.displayName = WrappedComponent.displayName ||  WrappedComponent.name ||  (WrappedComponent.constructor && WrappedComponent.constructor.name) ||  "Component";
    return Injector;
}


var timer = null;
export function WebRTCComponent<T extends IReactComponent>(WrappedComponent: T): T {
  // Support forward refs
  let Injector = React.forwardRef((props, ref) => {
    const newProps:any = { ...props };

    if (ref) {
      newProps.ref = ref;
    }
    class c extends React.Component{
      constructor(props){
        super(props)
        this.state = {
          show:false
        };
      }
      async componentDidMount(){
        console.log('WebRTCComponent componentDidMount')
        timer&&clearTimeout(timer)
        await _webrtc.localCameraPause();
        await new Promise(resolve => {setTimeout(resolve,300)})
        this.setState({
          show:true
        })
      }
      async componentWillUnmount(){
        console.log('WebRTCComponent componentWillUnmount')
        timer&&clearTimeout(timer)
        timer = setTimeout(()=>{
          _webrtc.localCameraPlay();
        },3000)
      }
      render(){
        if(!this.state.show)return null;
        return React.createElement( WrappedComponent, newProps);
      }
    }

    return React.createElement(c);
    
  });

  // Static fields from component should be visible on the generated Injector
  copyStaticProperties(WrappedComponent, Injector);
  Injector.wrappedComponent = WrappedComponent;
  Injector.displayName = WrappedComponent.displayName ||  WrappedComponent.name ||  (WrappedComponent.constructor && WrappedComponent.constructor.name) ||  "Component";
  return Injector;
}
