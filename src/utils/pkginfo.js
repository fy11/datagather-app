var pjson = require('../../package.json');
var Info = {
    appName: '',
    appVersion: '',
    appversionObj: {
        major: 0,
        minor: 0,
        later: 0,
        optimizing:0,
    }
}

Info.appName = pjson.name
Info.appVersion = pjson.version

var vstr = Info.appVersion;

var arr = vstr.split('.');
var obj = {};
Info.appversionObj.major = parseInt(arr[0]);
Info.appversionObj.minor = parseInt(arr[1]);
Info.appversionObj.later = parseInt(arr[2]);
if(arr.length > 3) {
    Info.appversionObj.optimizing = parseInt(arr[3]);
}

export default Info;