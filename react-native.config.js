module.exports = {
  dependencies: {
    "react-native-code-push":{
      platforms: {
        android: {
          "packageInstance": "new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG,\"http://api.code-push.com\")"
        },
        ios: null,
      },
    }
  },
};