//========== Framework Modules ==========//
var application = require("tns-core-modules/application");
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");

var datastore = require("~/modules/datastore");
var server = require("~/modules/server");

module.exports = observableModule.fromObject({
  //========== Properties ==========//

  //========== Functions ==========//

  //========== Handlers ==========//
  onLoaded(args){
    this.getUserInfoAsync();
    this.getUserFavouritesAsync();
    console.log("loaded welcome");
    timerModule.setTimeout(()=>{
      frameModule.topmost().navigate({
        moduleName: "pages/main/page",
        clearHistory: true,
        animated: true,
        transition: {
          name: "slideLeft",
        },
      });
    }, 700);
    if(application.android){
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
  },
  onUnloaded(args){
    if(application.android){
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
  },
  onBackButtonPressed(args){
    args.cancel = true;
  },
  async getUserInfoAsync(){
    console.log("getting user info");
    var response = await server.getSelfUserInfo();
    datastore.userInfo = response["user"][0];
    console.log(datastore.userInfo);
    console.log("userinfo");
  },
  async getUserFavouritesAsync(){
    var response = await server.getSelfFavourites();
    datastore.userFavourites = response["list"].map(a => a.post_id);
  },
});
