//========== Framework Modules ==========//
var application = require("tns-core-modules/application");
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var fromAsset = require("tns-core-modules/image-source").fromAsset;
var CameraPlus = require("@nstudio/nativescript-camera-plus").CameraPlus;

var datastore = require("~/modules/datastore");
var server = require("~/modules/server");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  screenHeight: 0,
  bottomSectionHeight: 0,

  cameraPlus: {},
  testImg: {},
  //========== Functions ==========//

  //========== Handlers ==========//
  onLoaded(args){
    this.screenHeight = platform.screen.mainScreen.heightDIPs;
    this.bottomSectionHeight = this.screenHeight - 65 - platform.screen.mainScreen.widthDIPs;
    this.camera = args.object.getViewById("camPlus");
    // this.testImg = args.object.getViewById("testImage");
    if(application.android){
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
    // this.camera.on(CameraPlus.photoCapturedEvent, (args) => {
    //   console.log(`photoCapturedEvent listener on main-view-model.ts  ${args}`);
    //   console.log(args.data);
    //   fromAsset(args.data).then(res => {
    //     console.log(typeof(res));
    //     console.log(res);
    //     this.testImg.src = res;
    //     console.log(this.testImg.src);
    //   });
    // });
  },
  onUnloaded(args){
    if(application.android){
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
  },
  onBackButtonPressed(args){
    args.cancel = true;
  },
  onTapCloseButton(args){
    frameModule.getFrameById("rootFrame").goBack();
  },
  onTapTakePictureButton(args){
    this.camera.takePicture({ saveToGallery: true});
  },
});
