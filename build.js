const fs = require('fs');
const os = require('os');
const child_process = require('child_process');
const path = require("path")
var parseArgs = require('minimist')

var npm_lifecycle_event = process.env.npm_lifecycle_event;
var regExpRes = new RegExp("build\_([a-z]+)\:([a-z]+)","gi").exec(npm_lifecycle_event);
if(!regExpRes)process.exit();

var argv = parseArgs(process.argv.slice(2));

console.log('build.js args:', argv);

var platform = regExpRes[1];
var mode = regExpRes[2];

var _env = argv.env || 'dev'
var _org = argv.org || 'default'


j();

(mode != "debug")&&r();

b();

function j(){
  //调用 jetify 修复引用
  child_process.execSync("npx jetify",{
    stdio :"inherit"
  })
}
function r(){
  //清理缓存
  var bundleCache = [
    "./android/app/build/generated/assets/react/release/index.android.bundle",
    "./android/app/build/generated/assets/react/prd/release/index.android.bundle",
    "./android/app/build/generated/assets/react/pre/release/index.android.bundle",
    "./android/app/build/generated/assets/react/dev/release/index.android.bundle" ];
    //检测文件存在同步清除此文件
      bundleCache.forEach(v=>{
    fs.existsSync(v)&&fs.unlinkSync(v)
  })
}
function b(){
  //调用打包
  var cmd = 'clean cleanBuildCache ';
  switch (mode) {
    case "debug":
      cmd = "assembleDevDebug";
      break;
    case "dev":
      cmd = "assembleDevRelease";
      break;
    case "pre":
      cmd = "assemblePreRelease";
      break;
    case "prd":
      cmd = "assemblePrdRelease";
      break;
    default:
      console.log("环境不存在")
  }

  cmd = cmd + ' -PBUILD_ORG=' + _org + ' -PBUILD_ENV=' + _env  +  ' --no-build-cache'  
  let runStr = `./gradlew ${cmd}`;
  os.platform() == "win32"&&(runStr = `gradlew.bat ${cmd}`);
  child_process.execSync(runStr,{
    stdio :"inherit",
    cwd:path.join(process.cwd(),"android"),
    env:Object.assign({},process.env,{
      "RN_ENV": mode,
      "RN_ORG": _org
    })
  })
}