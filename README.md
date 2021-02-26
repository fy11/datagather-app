## 打包

```bash
yarn build_android:dev #相当于 yarn build_android:dev --org=default --env=dev
yarn build_android:dev --env=dev
yarn build_android:dev --env=dev --org=default
```



### 常见问题 

## 添加一个新的组织

1. package.json 里orgs添加对应的配置和简称(key)
2. APP名字：修改package.json里的`name_cn`
3. 图标：android/app/src/main/res目录下添加对应的图标  `icon_launcher_组织简称.png`


#### 支付宝，微信 安卓构建失败

需要修改
node_modules\react-native-wechat\android\build.gradle
node_modules\react-native-yunpeng-alipay\android\build.gradle

compileSdkVersion
buildToolsVersion
targetSdkVersion
android\build.gradle 保持相同





### react-native-speech-iflytek 有关错误 
请下载讯飞msc SDK  把 libs 里面的文件放到node_modules\react-native-speech-iflytek\android\libs文件下

### debug.keystore 报错 
*What went wrong:
Execution failed for task ':app:validateSigningDevRelease'.
> Keystore file 'D:\web\servless-app\android\app\debug.keystore' not found for signing config 'debug'
需将keystore文件放入指定文件夹
