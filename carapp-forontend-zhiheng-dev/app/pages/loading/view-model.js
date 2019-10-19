//========== Framework Modules ==========//
var platformModule = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame"); 
var colorModule = require("tns-core-modules/color");
var appSettings = require("application-settings");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  showTapToStartLabel: true,
  isLoadComplete: false,

  //========== Functions ==========//


  //========== Handlers ==========//
  onLoaded(args){
    this.showTapToStartLabel = true;
    this.isLoadComplete = false;
    var deviceWidth = platformModule.screen.mainScreen.widthDIPs;
    var deviceHeight = platformModule.screen.mainScreen.heightDIPs;
    console.log("width: " + deviceWidth);
    console.log("height: " + deviceHeight);

    if(platformModule.isIOS && (deviceWidth == 414 || deviceWidth == 375) && deviceHeight > 811){
      appSettings.setBoolean('iPhoneX', true);
    } else {
      appSettings.setBoolean('iPhoneX', false);
    }
    appSettings.setBoolean("goToProfile", false);
    console.log("Notched iPhone: "+appSettings.getBoolean('iPhoneX'));
  },
  onUnloaded(args){

  },
  onLeftNumberWheelAnimationComplete(){
    timerModule.setTimeout(()=>{
      frameModule.topmost().navigate({
        moduleName: "pages/login/page",
        clearHistory: true,
        animated: true,
        transition: {
          name: "slideLeft",
        },
      });
    }, 500);
  },
  onTapTapDetector(args){
    this.isLoadComplete = true;
    this.showTapToStartLabel = false;
  },
});
