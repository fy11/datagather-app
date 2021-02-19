import React from 'react';
import { View, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react';
import { Button, Text, Overlay } from "react-native-elements";

import RNFetchBlob from 'rn-fetch-blob';
import { _ENV_, _ORG_ } from '@/utils/environment';

class ScreenProtect extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.props.homeStore;
    this.state = {};
  }

  async componentDidMount() {
    try {
    } catch (error) {
      console.log(error, "error");
    }
  }

  updateApp(url) {
    console.log(url, "url");
    // return ;
    try {
      this.setState({ isVisible: false });
      // this.setState({updateBtnDisabled:true,updateBtnTitle:'下载中,请稍后'})
      let dirs = RNFetchBlob.fs.dirs;

      RNFetchBlob.config({
        // response data will be saved to this path if it has access right.

        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // <-- this is the only thing required
          // Optional, override notification setting (default to true)
          notification: true,
          // Optional, but recommended since android DownloadManager will fail when
          // the url does not contains a file extension, by default the mime type will be text/plain
          mime: "application/vnd.android.package-archive",
          description: "更新文件下载中.",
          mediaScannable: true,
          path: dirs.DownloadDir + `/app-${new Date().getTime()}.apk`
        },
      })
        .fetch("GET", url, {
          //some headers ..
        })
        .then(res => {
          console.log(res);

          // alert(res.path())
          RNFetchBlob.android.actionViewIntent(
            res.path(),
            "application/vnd.android.package-archive"
          );
          // ApkInstaller.install(res.path());
        });
    } catch (error) {
      console.warn(error);
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <View>
     <Text>11111111111</Text> 
      </View>
    )
 
  }
}

const styles = StyleSheet.create({});
export default inject(["homeStore"])(observer(ScreenProtect));
