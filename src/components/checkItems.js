import { getBindTerminal, humanStatus, updateTerminalStatus } from "@/api/sensor";
import {
    getBatteryLevel,
    getPowerState,
    getModel,
    getProduct,
    getSystemName,
} from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo";
import idcard from "react-native-idcardreader"
import idcard3xx from "react-native-idcardreader/3xx"
import store from "@/store"
import moment from "moment";
// import Promise from "lie";
// var hunm, deviceMessage = {}, idMessage;
var checkPromiseList = [], iSidCardStart, DETAIL, checkPlan, connections;
export async function deviceCheck(code, val) {
    try {
        connections = await NetInfo.fetch();
        DETAIL = await getBindTerminal(code);
        if (DETAIL) {
            let DATA = '';
            if (val) {

                // console.log(val,'111val');
                if (val === 1) {
                    DATA = DETAIL.data.data.chatDeviceCheckPlan.chatDeviceCheckItemList;
                    checkPlan = '个人'


                }
                else {
                    DATA = DETAIL.data.data.chatDeviceCheckPlanDefault.chatDeviceCheckItemList;
                    checkPlan = '默认'
                    // debugger;
                }
            }
            else {
                // debugger;
                if (DETAIL.data.data.isDefault === 0) {
                    DATA = DETAIL.data.data.chatDeviceCheckPlanDefault.chatDeviceCheckItemList;
                    checkPlan = '默认'
                }
                else {
                    DATA = DETAIL.data.data.chatDeviceCheckPlan.chatDeviceCheckItemList;
                    checkPlan = '个人'
                }

            }
            checkPromiseList = [];
            // console.log(DATA)
            for (let i of DATA) {
                switch (i.checkItemCode) {
                    case "main_device":
                        checkPromiseList.push(Promise.resolve({ name: i.checkItem, result: true }));
                        break;
                    case "id_card":
                        checkPromiseList.push(new Promise((r => {
                            idcard.stop();
                            idcard.start();
                            var isOpen = false;
                            setTimeout(() => {
                                idcard.start();
                                setTimeout(() => {
                                    if (isOpen) {
                                        r({ name: i.checkItem, result: true });
                                        //脸上
                                    } else {
                                        //   checkIdCard=Promise.resolve({ name: i.checkItem, result: false })  
                                        // deviceCheckList.push({ name: i.checkItem, result: false });
                                        //meilians
                                        r({ name: i.checkItem, result: false });
                                    }
                                }, 1000)
                            }, 1000)
                            iSidCardStart = idcard.on((e) => {
                                if (e.code == -1) {
                                    isOpen = true;
                                }
                            })
                        })))
                        // ))
                        break;
                    case "id_300_card":
                        checkPromiseList.push(new Promise(async (resolve, reject) => {
                            try {
                                var mac = await store.homeStore.getId3xxMac()
                                console.log(mac,'mac');
                                if (!mac) {
                                    resolve({ name: i.checkItem, result: false })
                                    return;
                                }

                                idcard3xx.connect(mac).then(res => {
                                    resolve({ name: i.checkItem, result: res })
                                }).catch(res => {
                                    resolve({ name: i.checkItem, result: false })
                                })

                            } catch (e) {
                                resolve({ name: i.checkItem, result: false })
                            }


                        }))

                        // ))
                        break;
                    case "aiot_device":
                        checkPromiseList.push(Promise.resolve(...(await serviceCheck(i.checkItem, humanStatus(code)))));
                        break;
                }
            }

        }
        else {
            var iSidCardStart = null;
            console.log("没有自检方案");
            return;

        };
        const dataList = await Promise.all(checkPromiseList);
        // console.log(dataList,'dataList');

        let isPass = getDeviceStatus(dataList);
        //   console.log(isPass,'ispaa');
        //获取电量。获取设备型号.获取设备的电源状态，包括电池电量，是否已插入电池以及系统当前是否在低功耗模式下运行.整体产品名称。获取设备操作系统名称
        const decInfo = await Promise.all([getBatteryLevel(), getModel(), getSystemName()]);
        const deviceStatus = {
            deviceCode: code,
            checkStatus: isPass,
            checkInfo: systemData(dataList,decInfo),
        }
        const allData = {
                isPass,
                isDefult: DETAIL.data.data.isDefault,
                dataList,
            };
            console.log('走一次updateTerminalStatus')
            await updateTerminalStatus(deviceStatus);
            return allData;
        }
    catch (error) {
            var iSidCardStart = null;
            console.log(error, 'err');
        }

    }




function systemData(deviceInfo, terminalInfo) {

    return JSON.stringify({
        deviceInfo, terminalInfo: [
            { name: '电量', result: ~~(terminalInfo[0] * 100) },
            { name: '设备名', result: terminalInfo[1] },
            { name: '系统', result: terminalInfo[2] },
            { name: '自检时间', result: moment().format('YYYY-MM-DD HH:mm:ss') },
            { name: '自检方案', result: checkPlan },
            { name: '网络类型', result: connections.type},
            { name: '是否连接', result: connections.isConnected?'已连接':'未连接'},
        ],  
        details:connections.details,
    })
};
function getDeviceStatus(list) {
    let isPass = '';
    if (list.every(i => i.result)) {
        isPass = 0
    } else {
        list.forEach(v => {
            if (v.name === '主设备' && !v.result) {
                isPass = 1;
            }
            else {
                isPass = -1;
            }
        })

    }

    return isPass;
}
function serviceCheck(name, ...fn) {
    return Promise.all([...fn]).then(res => {
        // return 
        return res.map(i => {
            if (!i.data.data) {
                return ({ name, result: false });
            } else {
                return ({ name, result: true })
            }
        })
    })

}