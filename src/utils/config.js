// var emptyFn = ()=>{}
var o = {};
// ["info", "log", "warn", "debug", "error", "time", "timeEnd", "timeLog", "assert"].forEach(v=>{
//   if (!__DEV__) {
//     o[v] = emptyFn;
//   }else{
//   o[v] = console[v]||emptyFn;
//   }
// })
// global.console = o;
// console.disableYellowBox=true; //取消黄屏
// console._errorOriginal = console.error.bind(console); 
// console.error = () => {};

console.reportErrorsAsExceptions = false;
if (__DEV__) {
  GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
  global.FormData = global.originalFormData || global.FormData
  global.WebSocket = global.originalWebSocket || global.WebSocket
}


export default o;