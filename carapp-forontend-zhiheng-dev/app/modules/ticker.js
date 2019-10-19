/* NOTE:
  This script implements a tick event that fires at a fixed milliseconds interval, using the setInterval function.

  ticker: {
    tickEvent: string [get] //String of the event name of the tick event
    addToNotificationList: function(observable) //Adds an observable object to the list of objects to notify the tick event. Does nothing if the object is already in the list.
    addToNotificationList: function(observable) //Removes an observable object from the list of objects to notify the tick event.
  }

  tickEventData: {
    eventName: "tick"
    object: ticker //Reference to this module
    deltaTime: number //Milliseconds elapsed since last tick
  }


  //========== Usage Syntax ==========//
  //Require module
  var ticker = require(<path to this module>);

  //Within object scope
  onLoaded(){
    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);
  }
  onUnloaded(){
    ticker.removeFromNotificationList(this);
    this.off(ticker.tickEvent, this.onTick, this);
  }
  onTick(args){
    //Code to execute on tick
  }

*/

//========== Framework Modules ==========//
var application = require("tns-core-modules/application");
var platformModule = require("tns-core-modules/platform");
var timerModule = require("tns-core-modules/timer");
var application = require("tns-core-modules/application");

//========== Properties ==========//
var notificationList = new Set();
var prevTickTime = new Date();


var tickEvent = module.exports.tickEvent = "tick";

//========== Functions ==========//
module.exports.addToNotificationList = function(observable){
  notificationList.add(observable);
}
module.exports.removeFromNotificationList = function(observable){
  notificationList.delete(observable);
}

//========== Init ==========//

//Android
if(platformModule.device.os == "Android"){

  var tickInterval = 1;

  timerModule.setInterval(()=>{
    var currTickTime = new Date();
    var deltaTime = currTickTime - prevTickTime;
    prevTickTime = currTickTime;

    for(var obj of notificationList){
      obj.notify({
        eventName: tickEvent,
        object: exports,
        deltaTime: deltaTime,
      });
    }
  }, tickInterval);
}

//iOS
if(platformModule.device.os == "iOS"){

  var tickInterval = 1000 / 60;

  timerModule.setInterval(()=>{
    for(var obj of notificationList){
      obj.notify({
        eventName: tickEvent,
        object: exports,
        deltaTime: tickInterval,
      });
    }
  }, tickInterval);
}
