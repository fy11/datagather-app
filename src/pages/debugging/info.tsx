import {
  getBatteryLevel,
  getFreeDiskStorageSync,
  getTotalDiskCapacitySync,
  getTotalMemorySync,
  getUsedMemorySync
} from "react-native-device-info";
import {
  NativeEventEmitter,
  NativeModules,
  View,
  Text,
  NetInfo
} from "react-native";
import React, { useState, useEffect } from "react";

const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo);
export function useBatteryLevel(): number | null {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    const setInitialValue = async () => {
      const initialValue: number = await getBatteryLevel();
      setBatteryLevel(initialValue);
    };

    const onChange = (level: number) => {
      setBatteryLevel(level);
    };

    setInitialValue();

    const subscription = deviceInfoEmitter.addListener(
      "RNDeviceInfo_batteryLevelDidChange",
      onChange
    );

    return () => subscription.remove();
  }, []);

  return batteryLevel;
}
export function useNetInfo(): String | null {
  const [netInfo, setNetInfo] = useState<String | null>(null);

  useEffect(() => {
    const setInitialValue = async () => {
      NetInfo.fetch().done((reach) => {
        setNetInfo(reach)
      });
    };

    const onChange = (reach: String) => {
      setNetInfo(reach);
    };

    setInitialValue();

    NetInfo.addEventListener("change", onChange);

    return () => NetInfo.removeEventListener("change", onChange);
  }, []);

  return netInfo;
}
function DeviceInfo() {
  const [state, setState] = useState({
    freeDisk: "",
    totalDisk: "",
    totalMemory: "",
    usedMemory: ""
  });
  const batteryLevel = useBatteryLevel(); // 电池电量
  const netInfo = useNetInfo(); // 电池电量
  useEffect(() => {
    const freeDisk = getFreeDiskStorageSync(); //剩余空间
    const totalDisk = getTotalDiskCapacitySync(); //全部空间
    const totalMemory = getTotalMemorySync(); //全部空间
    const usedMemory = getUsedMemorySync(); //全部空间
    setState({
      freeDisk,
      totalDisk,
      totalMemory,
      usedMemory
    });
  }, []);
  return (
    <View>
      <Text>电池电量：{batteryLevel}</Text>
      <Text>空闲空间：{state.freeDisk}</Text>
      <Text>全部空间：{state.totalDisk}</Text>
      <Text>使用内存：{state.usedMemory}</Text>
      <Text>全部内存：{state.totalMemory}</Text>
      <Text>网络状态：{netInfo}</Text>
    </View>
  );
}

export default DeviceInfo;
