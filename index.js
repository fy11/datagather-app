import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import "@/utils/config"
import codePush from "react-native-code-push"
import { _ENV_ } from "@/utils/environment"
let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

import * as Sentry from '@sentry/react-native';
import { CaptureConsole } from '@sentry/integrations';

import store from "@/store"
try {
  Sentry.init({
    dsn: 'http://servless_app@errlog.dc-p.cn/report',
    environment:_ENV_,
    maxBreadcrumbs: 0,
    integrations: [
        new CaptureConsole({
            levels: ['error']
        })
    ],
    beforeSend(event,hint){
      event.deviceCode = store.homeStore.uniqueId;
      event.customerId = store.homeStore.customerId;
      event.productId = store.homeStore.productId;
      try {
          event.sessionId = store.homeStore.chat.store.chatSessionId;
      } catch (error) {
          //ignore
      }
      
      return event;
    }
  });
  
} catch (error) {
  console.log(error,'sentry error ');
  
}


     
AppRegistry.registerComponent(appName, () =>codePush(codePushOptions)(App));

