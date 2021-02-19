import environment from "./environment"
import request from "./request"
import {Dimensions} from "react-native"

export default {
  environment,
  window:{
    screenH:Dimensions.get('window').height,
    screenW:Dimensions.get('window').width,
  },
  request
}


//https://github.com/mobxjs/mobx-react/blob/master/src/utils/utils.js

export type IReactComponent<P = any> =
    | React.StatelessComponent<P>
    | React.ComponentClass<P>
    | React.ClassicComponentClass<P>

const hoistBlackList = {
  $$typeof: 1,
  render: 1,
  compare: 1,
  type: 1,
  childContextTypes: 1,
  contextType: 1,
  contextTypes: 1,
  defaultProps: 1,
  getDefaultProps: 1,
  getDerivedStateFromError: 1,
  getDerivedStateFromProps: 1,
  mixins: 1,
  propTypes: 1
}

export function copyStaticProperties(base, target) {
  const protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(base))
  Object.getOwnPropertyNames(base).forEach(key => {
      if (!hoistBlackList[key] && protoProps.indexOf(key) === -1) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(base, key))
      }
  })
}