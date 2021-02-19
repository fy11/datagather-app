import { observable, action,computed } from "mobx";
import AsyncStorage from "@react-native-community/async-storage";

class UserStore {
  @observable token;
  @observable userCenter;

  constructor() {
    this.token = "";
    this.userCenter = null;
  }
  @computed get user() {
      return this.token.length>0;
  }
  @action
  async SetToken(t) {
      this.token = t;
      try {
          await AsyncStorage.setItem('@xiaoming:token', t);
      } catch (error) {
          // Error saving data
      }
  }

  @action
  async GetToken() {
      if (this.token) return this.token;
      try {
          return this.token = await AsyncStorage.getItem('@xiaoming:token') || "";
      } catch (error) {
          // Error retrieving data
      }
      return "";
  }

  @action
  async SetUserCenterData(data){
    this.userCenter = data;
    AsyncStorage.setItem('@xiaoming:userCenterData', JSON.stringify(data));
  }
}

const userStore = new UserStore(); 

AsyncStorage.getItem('@xiaoming:userCenterData').then(res=>{
    if(res)userStore.userCenter = JSON.parse(res);
})
userStore.GetToken();

export { userStore };