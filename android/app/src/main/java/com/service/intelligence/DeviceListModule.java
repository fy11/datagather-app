package com.service.intelligence;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.blankj.utilcode.util.PermissionUtils;
import com.blankj.utilcode.util.ToastUtils;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import serial.jni.BluConnectionStateListener;
import serial.jni.DataUtils;
import serial.jni.NativeCallBack;

public class DeviceListModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    private final ReactApplicationContext reactContext;
    private BluetoothAdapter mBluetoothAdapter= null;
    private JSONObject jsonObject;
    private DataUtils data;
    private int gatherTime;
    private int intervalTime;
    private boolean isdata =false;
    /**
     * 广播接收蓝牙数据
     */

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent
                        .getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getName() != null) {
                    try {
                        jsonObject.put("name",device.getName());
                        jsonObject.put("address",device.getAddress());
                        sendEvent(jsonObject.toString());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }else if (action.equals(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)){
                searchFinsh();
            }
        }
    };

    public DeviceListModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        reactContext.addLifecycleEventListener(this);
        init();
    }

    String[] pers = {"android.permission.ACCESS_FINE_LOCATION","android.permission.ACCESS_COARSE_LOCATION"};
    private void initP() {
        PermissionUtils.permissionGroup(pers).callback(new PermissionUtils.SimpleCallback() {
            @Override
            public void onGranted() {
                mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
                if(mBluetoothAdapter == null){
                    // 说明此设备不支持蓝牙操作
                    Toast.makeText(reactContext, "没有找到蓝牙硬件或驱动！", Toast.LENGTH_LONG).show();
                }else {
                    if (!mBluetoothAdapter.isEnabled()){   // 没有开启蓝牙
                        mBluetoothAdapter.enable();
                    }else {
                        doDiscovery();
                    }
                }
            }

            @Override
            public void onDenied() {

            }
        }).request();
    }

    private void init() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(BluetoothDevice.ACTION_FOUND);
        filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
        reactContext.registerReceiver(mReceiver, filter);
        jsonObject = new JSONObject();
    }


    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        reactContext.unregisterReceiver(mReceiver);
    }

    @NonNull
    @Override
    public String getName() {
        return "BluetoothDevice";
    }

    /**
     * 停止搜索暴漏方法
     */
    @ReactMethod
    public void stopSearch(){
        if (mBluetoothAdapter != null) {
            mBluetoothAdapter.cancelDiscovery();
        }
        reactContext.unregisterReceiver(mReceiver);
    }


    /**
     * 开始搜索蓝牙暴漏方法
     */
    @ReactMethod
    public void startSearch(){
        initP();
    }

    /**
     * 连接蓝牙暴漏方法
     * @return  //  {"name":"CB2000015","address":"00:04:3E:54:EB:89"}  //    {"name":"realme X50 Pro 5G","address":"D0:28:BA:E6:28:56"}
     * mac mac地址
     */
    @ReactMethod
    public void setConnection(String mac){
        data = new DataUtils(getCurrentActivity(), mac,DataUtils.ECG_LEAD_WILSON,true,
                new BluConnectionStateListener() {
                    @Override
                    public void OnBluConnectionInterrupted() {
                        connectionState("interrupt");
                    }

                    @Override
                    public void OnBluConnectSuccess() {
                        connectionState("success");
                    }

                    @Override
                    public void OnBluConnectStart() {
                        connectionState("start");
                    }

                    @Override
                    public void OnBluConnectFaild() {
                        connectionState("error");
                    }
                });
            data.gatherStart(new nativeMsg());
    }




    /**
     * 发送蓝牙状态
     */
    private void connectionState(String state){
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(Constants.BLUE_CONNECTION_STATE, state);

    }

    /**
     * 发送数据给蓝牙设备
     */
    private void sendEvent(String data) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(Constants.BLUE_DEVICE_DATA, data);
    }

    /**
     *  告诉RN 蓝牙搜索结束
     */
    private void searchFinsh() {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(Constants.SEARCH_FINSH, "success");
    }

    /**
     * 开始查找蓝牙设备
     */
    private void doDiscovery() {
        if (mBluetoothAdapter.isDiscovering()) {
            mBluetoothAdapter.cancelDiscovery();
        }
        mBluetoothAdapter.startDiscovery();
        Toast.makeText(reactContext, "开始搜索设备", Toast.LENGTH_LONG).show();
    }


    /**
     * 设置参数
     */
    @ReactMethod
    public void setParamets(ReadableMap map){
        ToastUtils.showLong(map.getInt("gatherTime")+"");
        this.gatherTime = map.getInt("gatherTime");  // 采集时长
        this.intervalTime = map.getInt("intervalTime");   // 血压间隔时间
    }

    /**
     * 设置参数
     */
    @ReactMethod
    public void setParamets(int gatherTime,int intervalTime){
        ToastUtils.showLong(gatherTime+"");
        this.gatherTime = gatherTime;  // 采集时长
        this.intervalTime = intervalTime;   // 血压间隔时间
    }

    /**
     * 设置参数
     */
    @ReactMethod
    public void getData(){
        isdata = true;
    }



    /**
     *  发送数据
     */
    private void getDataPush(short[] s) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(Constants.SEND_DATA, s);
    }


    class nativeMsg extends NativeCallBack {


        @Override
        public void callHRMsg(short hr) {// 心率
           // mHandler.obtainMessage(MESSAGE_UPDATE_HR, hr).sendToTarget();
        }

        @Override
        public void callLeadOffMsg(String flagOff) {// 导联脱落
            // Log.e("LF", flagOff);
          //  mHandler.obtainMessage(MESSAGE_UPDATE_LeadOff, flagOff).sendToTarget();
        }

        @Override
        public void callProgressMsg(short progress) {// 文件存储进度百分比 progress%
            Log.e("progress", "" + progress);
        }

        @Override
        public void callCaseStateMsg(short state) {
            if (state == 0) {
                Log.e("Save", "start");// 开始存储文件
            } else {
                Log.e("Save", "end");// 存储完成
            }
        }

        @Override
        public void callHBSMsg(short hbs) {// 心率 hbs = 1表示有心跳
            // Log.e("HeartBeat", "Sound"+hbs);
        }

        @Override
        public void callBatteryMsg(short per) {// 采集盒电量
            // Log.e("Battery", ""+per);
        }

        @Override
        public void callCountDownMsg(short per) {// 剩余存储时长
            // Log.e("CountDown", ""+per);
        }

        @Override
        public void callWaveColorMsg(boolean flag) {
            Log.e("WaveColor", "" + flag);
        }
        @Override
        public void callEcgWaveDataMsg(short[] wave) {    // 这块处理数据 12 导
            for (int i = 48; i < 60; i++) {
                if (isdata){
                    getDataPush(wave);
                }
               // Log.e("AAA",wave[i]+"");

            }
        }

        @Override
        public void callEcg18WaveDataMsg(short[] wave) {  // 这块处理数据  18导
            // TODO Auto-generated method stub

        }
        @Override
        public void callVcgWaveDataMsg(short[] wave) {
            // TODO Auto-generated method stub

        }

        @Override
        public void callVcgWaveRPosMsg(int[] flag) {
            // TODO Auto-generated method stub

        }


        @Override
        public void callNibpStateMsg(byte flag, byte type) {
            // TODO Auto-generated method stub
            super.callNibpStateMsg(flag, type);
        }

        @Override
        public void callNibpResultMsg(short sys, short dia, short mea,
                                      short pr, byte err) {
            // TODO Auto-generated method stub
            super.callNibpResultMsg(sys, dia, mea, pr, err);
            Log.e("callNibpResultMsg", "sys : " + sys +" dia : " + dia + " mea : " + mea);
            data.BluNIBPConfirmCmd();
        }

        @Override
        public void callSpO2ResultMsg(short spo2, short pr, byte state) {
            // TODO Auto-generated method stub
            super.callSpO2ResultMsg(spo2, pr, state);
            if (spo2 > 0) {
                Log.e("callSpO2ResultMsg", "spo2 : " + spo2 + "  pr : " + pr);
            }
        }

        @Override
        public void callNibpCuffMsg(short val) {
            // TODO Auto-generated method stub
            super.callNibpCuffMsg(val);
            Log.e("callNibpCuffMsg", "cuff : " + val);

        }

        @Override
        public void callSpO2ConntectStateMsg(short state) {
            // TODO Auto-generated method stub
            super.callSpO2ConntectStateMsg(state);
        }

    }

}
