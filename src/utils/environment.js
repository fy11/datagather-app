
const _ENV_ = process.env['RN_ENV'] || "dev";
const _ORG_ = process.env['RN_ORG'] || 'default';

var configObj = { // default
  "dev":{
    // BASEURL:"https://dev-servless-api.hzhengji.cn",
    CLIENTURL:"https://dev-servless-admin.hzhengji.cn",

    BASEURL:"http://192.168.0.155:8082",
    CHATURL:"http://dev-ichat-client.hzhengji.cn/about.html?productId=31",   
    USERCENTERURL:"http://dev-gateway-api.hzhengji.cn",
  },
  "pre":{
    BASEURL:"https://pre-servless-api.dc-p.cn",
    CHATURL:"https://pre-ichat-client.dc-p.cn//about.html?productId=24",
    CLIENTURL:"https://dev-servless-admin.hzhengji.cn",
    USERCENTERURL:"http://dev-gateway-api.hzhengji.cn"
  },
  "prd":{
    BASEURL:"https://servless-api.dc-p.cn",
    CHATURL:"https://ichat-client.dc-p.cn//about.html?productId=24",
    CLIENTURL:"https://servless-admin.dc-p.cn",

    USERCENTERURL:"http://dev-gateway-api.hzhengji.cn",
  },
  "ay": { //安阳
    "prd": {
      BASEURL:"https://servless-ay01-api.dc-p.cn",
    }
  },
  "mc": { //安阳
    "prd": {
      BASEURL:"https://mc-servless-api.dc-p.cn",
    }
  },
  "jk": { //今科
    "pre":{
      BASEURL:"https://pre-jk-servless-api.dc-p.cn",
    },
    "prd": {
      BASEURL:"https://jk-servless-api.dc-p.cn",
    CLIENTURL:"https://jk-servless-admin.dc-p.cn",

    }
  }
}


function getOrgSuffix(orgname) {
  return (orgname == 'default' || orgname == '' || orgname == null) ? '' : '_' + orgname
}

function getRuntimeConfObject(orgname, env) {
  var _confobj = JSON.parse(JSON.stringify(configObj));
  var _orgconf = _confobj[orgname]
  if (_orgconf) {
    Object.keys(_orgconf).forEach(key => {
      Object.assign(_confobj[key], _orgconf[key]);
    });
  }
  console.debug('runtime org:', orgname, 'env:', env, 'config:', _confobj[env])
  return _confobj[env];
}


export {
  _ENV_,
  _ORG_
}

export default getRuntimeConfObject(_ORG_, _ENV_); 

