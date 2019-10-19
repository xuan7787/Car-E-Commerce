var platformModule = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var cardViewModule = require("nativescript-cardview");
var propertiesModule = require("tns-core-modules/ui/core/properties");
var appSettings = require("application-settings");

class CarInfoCardDrawer extends cardViewModule.CardView{
  /* NOTE:
    //Animated drawer attached to the bottom of the screen. The drawer features drop shadow, allows y-axis panning to move the drawer, and swiping downwards to close drawer. Inherited from CardView.'

    duration: number //Transition duration in milliseconds
    
    _panStartTranslateY: number //For tracking position of drawer upon starting pan gesture
    _panStartTime: Date //For tracking duration of swipe upon starting pan gesture
    _isBeingSwipedDown: bool //Set to true for the frame that the drawer was released, if the swipe has enough downward speed

    setToOpen: function() //Instantly moves the drawer to the open position without animation time
    setToClose: function() //Instantly moves the drawer to the closed position without animation time

    State: number //For tracking the state of drawer. (0: closed, 1: open, 2: suspended)
  */
  //========== Properties ==========//
  get State(){
    return this._drawerState;
  }
  set State(value){
    this._drawerState = value;
  }
  //========== Functions ==========//
  setToOpen(){
    this.animate({
      translate: {
        x: 0,
        y: 0,
      },
      duration: this.duration,
    });

    this.State = 1;
  }
  setToSuspended(){
    if(appSettings.getBoolean('iPhoneX')){ // Need special case to handle notched iPhones
      // Notched iPhones have their own iOS drawer, height of the suspended drawer is higher to prevent conflicts
      this.animate({
        translate: {
          x: 0,
          y: this.height-158,
        },
        duration: this.duration,
      });
    } else { // Other phones
      this.animate({
        translate: {
          x: 0,
          y: this.height-102,
        },
        duration: this.duration,
      });
    }

    this.State = 2;
  }
  setToClose(){
    this.animate({
      translate: {
        x: 0,
        y: this.height,
      },
      duration: this.duration,
    });
    this.State = 0;
  }
  
  setToOpenNoAnimation(){
    this.translateY = 0;
    this.State = 1;
  }
  setToSuspendedNoAnimation(){
    if(appSettings.getBoolean('iPhoneX')){
      this.translateY = this.height-158;
    } else { // Other phones
      this.translateY = this.height-102;
    }

    this.State = 2;
  }
  setToCloseNoAnimation(){
    this.translateY = this.height;

    this.State = 0;
  }

  // setToOpen(){
  //   this._drawerState = 1;
  //   this.translateY = 0;
  // }
  // setToSuspended() {
  //   this.translateY = 620;
  //   this._drawerState = 2;
  // }
  // setToClose(){
  //   this.translateY = this.height;
  //   this._drawerState = 0;
  // }
  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);

    this._panStartTranslateY = 0;
    this._isBeingSwipedDown = false;

    this.height = +this.height;
    this.duration = +this.duration;

    var drawerState = this.State;
    if(drawerState == 0){
      setTimeout(()=>{
        this.setToCloseNoAnimation();
      }, 0);
    }
    else if(drawerState == 1){
      setTimeout(()=>{
        this.setToOpenNoAnimation();
      }, 0);
    }
    else if(drawerState == 2){
      setTimeout(()=>{
        this.setToSuspendedNoAnimation();
      }, 0);
    }

    //Set up pan event handler
    this.on(gesturesModule.GestureTypes.pan, this.onPan, this);
  }
  onUnloaded(args){
    super.onUnloaded(args);

    this.off(gesturesModule.GestureTypes.pan, this.onPan, this);
  }
  onPan(args){
    if(!appSettings.getBoolean("drawerPanLock")){
      switch(args.state){
        case 1://Pan start
          this._panStartTranslateY = this.translateY;
          this._panStartTime = new Date();
          break;
        case 2://Pan maintain
          this.translateY = Math.max(this._panStartTranslateY + args.deltaY, 0);
          break;
        case 3://Pan end
          var panDuration = new Date() - this._panStartTime;
          var panDeltaY = this.translateY - this._panStartTranslateY;
          var panDipPerMs = panDeltaY / panDuration;            //Speed of downward swipe, in DIPs per Millisecond

          var drawerPositionRatio = this.translateY / this.height; //Value between 0 to 1, represent percentage of how much the drawer is opened

          if(drawerPositionRatio >= 0.5 || panDipPerMs > 0.4){//If drawer is released more than halfway point, or the swipe is fast enough, close drawer
            this.setToClose();
          } else {//Otherwise, open the drawer
            this.setToOpen();
          }
          break;
      }
    }
  }
}
//========== View Properties ==========//
var properties = {
  duration: new propertiesModule.Property({
    name: 'duration',
    defaultValue: 500,
  }),
  drawerState: new propertiesModule.Property({
    name: 'drawerState',
    defaultValue: 0,
    valueChanged(target, oldValue, newValue){
      target.State = newValue;
    }
  })
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(CarInfoCardDrawer);
module.exports.CarInfoCardDrawer = CarInfoCardDrawer;
