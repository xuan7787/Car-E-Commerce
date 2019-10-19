var app = require("~/app");
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  icons: app.icons,

  selectedDate: "",

  bottomCardDrawer: {},
  BottomCardDrawerCalendar: {},
  //========== Functions ==========//


  //========== Handlers ==========//
  onLoaded(args){
    this.bottomCardDrawer = args.object.getViewById("BottomCardDrawer");
    this.BottomCardDrawerCalendar = args.object.getViewById("BottomCardDrawerCalendar");

    this.BottomCardDrawerCalendar.setDrawerReference(this.bottomCardDrawer);

    /*this.BottomCardDrawerCalendar.on(this.BottomCardDrawerCalendar.cellTapEvent, args=>{
      this.onCalendarCellTap(args);
    });*/
  },
  onTapOpenDrawerButton(args){
    this.bottomCardDrawer.isOpen = true;
  },
  onCalendarDateSelected(args){
    console.log("select date");
  },
});
