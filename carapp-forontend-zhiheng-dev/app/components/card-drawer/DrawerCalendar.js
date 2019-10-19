var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var calendarModule = require("nativescript-ui-calendar");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class DrawerCalendar extends calendarModule.RadCalendar{
  /* NOTE:
    //calendar used in the bottom card drawer

    _bottomCardDrawer: BottomCardDrawer //Holds reference to the parent BottomCardDrawer object

    setDrawerReference(bottomCardDrawer){ //For setting the reference to the BottomCardDrawer object that contains this calendar, to be called upon page load
      bottomCardDrawer: BottomCardDrawer //Reference to the BottomCardDrawer object
    }
  */
  //========== Functions ==========//
  setDrawerReference(bottomCardDrawer){
    this._bottomCardDrawer = bottomCardDrawer;
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);

    //Disable double tap switching calendar to month view
    this.nativeView.getGestureManager().setDoubleTapToChangeDisplayMode(false);
    this.nativeView.getGestureManager().setPinchCloseToChangeDisplayMode(false);

    //Set up pan event handler
    this.on(gesturesModule.GestureTypes.pan, this.onPan, this);
  }
  onUnloaded(args){
    super.onUnloaded(args);
    this.off(gesturesModule.GestureTypes.pan, this.onPan, this);
  }
  onPan(args){
    if(this._bottomCardDrawer){
      this._bottomCardDrawer.onPan(args);
    }
  }
}
//========== View Properties ==========//
var properties = {};

//========== Initialize ==========//
for(var key in properties) properties[key].register(DrawerCalendar);
module.exports.DrawerCalendar = DrawerCalendar;
