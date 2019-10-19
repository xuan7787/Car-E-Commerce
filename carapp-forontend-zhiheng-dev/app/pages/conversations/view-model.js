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
  currentTab: "Inbox",

  conversationsData: new observableArrayModule.ObservableArray(),
  //========== Functions ==========//
  seedConversations(){
    var tempData = []
    tempData.push(
      {
        senderImage: '~/images/graphics/image_placeholder_leekam.png',
        senderName: "Leekam",
        lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
        datetime: moment().hour(18).minute(27).subtract(1,'days').calendar(null, {
          lastDay : '[Yesterday,] HH:mm',
          sameDay : '[Today,] HH:mm',
          nextDay : '[Tomorrow at] HH:mm',
          lastWeek : '[last] dddd [at] HH:mm',
          nextWeek : 'dddd [at] HH:mm',
          sameElse : 'L'
        }),
        lastMessageImage: '~/images/graphics/image_placeholder_carwithgate.png',
      }
    )
    for(var i=0;i<7;i++){
      tempData.push(
        {
          senderName: "Leekam",
          lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
          datetime: moment().hour(18).minute(27).subtract(1,'days').calendar(null, {
            lastDay : '[Yesterday,] HH:mm',
            sameDay : '[Today,] HH:mm',
            nextDay : '[Tomorrow at] HH:mm',
            lastWeek : '[last] dddd [at] HH:mm',
            nextWeek : 'dddd [at] HH:mm',
            sameElse : 'L'
          })
        }
      )
    }
    this.conversationsData = new observableArrayModule.ObservableArray(tempData);
  },
  //========== Handlers ==========//
  onLoaded(args){
    this.viewWidth = appSettings.getNumber("viewWidth");
    this.seedConversations();
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
  },
  onTapTabButton(args){
    this.currentTab = args.object.text;
  },
  onTapConversation(args){
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/conversations/messages/page",
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
  }
});