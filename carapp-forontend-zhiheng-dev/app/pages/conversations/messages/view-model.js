//========== Framework Modules ==========//
var application = require("tns-core-modules/application");
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var appSettings = require("application-settings");
var moment = require("moment");

var datastore = require("~/modules/datastore");
var server = require("~/modules/server");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  viewWidth: 0,
  senderImage: "~/images/graphics/image_placeholder_leekam.png",

  messagesData: new observableArrayModule.ObservableArray(),
  //========== Functions ==========//
  seedMessages(){
    var tempData = []
    tempData.push({
        sent: false,
        content: "Lorem ipsum dolor sit amet",
        datetime: moment().hour(22).minute(31).format('HH:mm'),
    });
    tempData.push({
      sent: true,
      content: "Lorem ipsum dolor sit amet, adipiscing elit, sed do eius",
      datetime: moment().hour(22).minute(32).format('HH:mm'),
  });
  tempData.push({
    sent: false,
    content: "Viewing Session at 4 August 2018 — 2pm - 3pm",
    datetime: moment().hour(22).minute(34).format('HH:mm'),
});
    this.messagesData = new observableArrayModule.ObservableArray(tempData);
  },
  //========== Handlers ==========//
  onLoaded(args){
    this.viewWidth = appSettings.getNumber("viewWidth");
    this.seedMessages();
    if(application.android){
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.onTapBackButton, this);
    }
  },
  onUnloaded(args){
    if(application.android){
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.onTapBackButton, this);
    }
  },
  onTapBackButton(args){
    frameModule.getFrameById("rootFrame").goBack();
  }
});
