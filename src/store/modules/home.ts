import {observable, action, autorun} from "mobx";
import Utils from "@/utils"
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from "react-native";
class HomeStore {
    @observable text; // 注册变量，使其成为可检测的
    @observable num;
    @observable lodding;
    @observable gps;
    @observable cityId;
    @observable imageViewer;
    @observable selectMap;
    @observable imageCrop;
    @observable router;
    @observable productId;
    @observable uniqueId;
    @observable aiAbility;
    @observable AddressInfo;
    @observable tabList;
    @observable id3xxMac;
    @observable showVideo;
    chat;

    constructor() {
        this.num = 0; // 初始化变量，可以定义默认值
        this.text = "Hello, this is homePage!!!";
        this.gps = null;
        this.cityId = 0;
        this.imagesUrl=null;
        this.chat = null;
        this.sId=null;
        this.productId = 0;
        this.gatheringMoney=0
        // this.initBackdrop='';
        this.uniqueId = null;
        this.tabList=[],
        this.productItem={};
        this.aiAbility = {

        }
        this.AddressInfo = {

        }
        this.id3xxMac = "";
        this.showVideo = false;
    }


    @action
    async SetAiAbility(t) {
        this.aiAbility = t;
    }
    @action
    async SetAddressInfo(t) {
        this.AddressInfo = t;
    }
    @action  // 方法推荐用箭头函数的形式
    plus = () => {
        this.num += 1;
    };

    @action
    minus = () => {
        this.num -= 1;
    };

    @action
    initLoading(ref) {
        this.lodding = ref;
    }

    @action
    initRootImageViewer(ref) {
        this.imageViewer = ref;
    }

    @action
    initRootSelectMap(ref) {
        this.selectMap = ref;
    }

    @action
    initRootImageCrop(ref) {
        this.imageCrop = ref;
    }

    @action
    initRouter(ref) {
        this.router = ref;
    }
    @action
    addImageUrl(ref) {
        this.imagesUrl = ref;
    }
    @action
    getL(): Promise<GetLRes> {
        if (this.gps) {
            return Promise.resolve(this.gps)
        }
        return Utils.gps().then((res: GetLRes) => {
            this.gps = res;
            this.cityId = parseInt(res.location.adCode.substr(0, 4) + "00")
            return this.gps;
        });
    }
    @action
    getMoney(money) {
        this.gatheringMoney = money;
    }

    @action
    async SetProduct(t) {
        this.productId = t;
    }
    @action
    async SetItems(t) {
        this.productItem = t;
    }


    @action
    async SetUniqueId(t) {
        this.uniqueId = t;
    }
    @action
    async SetSId(t) {
        this.sId = t;
    }

    @action
    async SetTablist(t) {
        this.tabList=t;
        this.SetTablistLocalStore(t)
    }
    @action
    async SetTablistLocalStore(t) {
        try {
            await AsyncStorage.setItem('@xiaoming:tabList', JSON.stringify(t));
        } catch (error) {
            console.error(error)
            // Error saving data
        }
    }
 //  @action

//     (async ()=>{
//     try {
//         const value = await AsyncStorage.getItem('@xiaoming:tabList');
//         if(value)homeStore.tabList = JSON.parse(value)
//     } catch (error) {
//         console.error(error)
//         // Error retrieving data
//     }
// })()
}

const homeStore = new HomeStore();

export {homeStore, HomeStore};


interface Coords {
    accuracy: number;
    altitude: number;
    altitudeAccuracy?: any;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
}

interface Location {
    accuracy: number;
    adCode: string;
    address: string;
    altitude: number;
    city: string;
    cityCode: string;
    coordinateType: string;
    country: string;
    description: string;
    district: string;
    errorCode: number;
    errorInfo: string;
    gpsAccuracy: number;
    heading: number;
    latitude: number;
    locationDetail: string;
    locationType: number;
    longitude: number;
    poiName: string;
    province: string;
    speed: number;
    street: string;
    streetNumber: string;
    timestamp: number;
    trustedLevel: number;
}

interface GetLRes {
    coords: Coords;
    location: Location;
    timestamp: number;
}



