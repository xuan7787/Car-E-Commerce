//========== App Modules ==========//
var enums = require("~/modules/enums");

//========== View Model References ==========//
var mainPageViewModel = require("../view-model");

//========== Framework Modules ==========//
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var appSettings = require("application-settings");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  searchSettingNames: [
    'Nissan Altama',
    'BMW Roadster',
    'Toyota Corella',
    'Nissan Altama',
    'BMW Roadster',
    'Toyota Corella',
  ],
  savedSearchSettings: [], //<SearchSetting[]>
  searchSettingNotificationCounts: [],

  //Variables that changes on devices with different widths
  viewWidth: 0,
  savedSearchesImageWidth: 0,
  notificationNumberDisplacement: 0,


  //========== Functions ==========//


  //========== Handlers ==========//
  onLoaded(args){

    mainPageViewModel.onEnterDashboard();
    this.viewWidth = appSettings.getNumber("viewWidth");
    // Calculate how big each savedSearches image should be
    this.savedSearchesImageWidth = Math.round((this.viewWidth - 30)/3);
    this.notificationNumberDisplacement = this.savedSearchesImageWidth - 22;

    // TEMP:
    this.searchSettingNotificationCounts = [
      2,
      0,
      3,
      0,
      4,
      5,
    ];
  },
  onTapDashboardToolsButton(args){
    mainPageViewModel.onTapDashboardToolsButton();
  }
});
