var events = new Map();

function on(eventName,handler){
  if(events.has(eventName)){
    events.get(eventName).add(handler);
    return;
  }
  
  events.set(eventName,new Set([handler]));
}

function off(eventName,handler){
  if(!events.has(eventName)){
    return;
  }
  events.get(eventName).delete(handler);
}

function once(eventName,handler){
  function one(){
    handler.apply(this,arguments);
    off(eventName,one);
  }
  on(eventName,one);
}

function emit(eventName,...args){
  if(!events.has(eventName))return;
  events.get(eventName).forEach(fn=>{
    fn.apply(this,args);
  })
}

// export default {
//   on,off,once,emit
// }
export default {
  on,off,once,emit
}

