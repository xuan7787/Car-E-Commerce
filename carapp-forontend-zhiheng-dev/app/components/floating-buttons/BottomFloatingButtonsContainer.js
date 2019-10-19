var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var absoluteLayoutModule = require("tns-core-modules/ui/layouts/absolute-layout");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class BottomFloatingButtonsContainer extends absoluteLayoutModule.AbsoluteLayout{
  /* NOTE:
    //An element for containing floating buttons at the bottom of the screen. Inherited from AbsoluteLayout
    isShown: bool [get, set] //Animates button to its shown or hidden position upon setting value
    hiddenTranslateY: number //Amount of translateY to apply when hiding the buttons
    duration: number //Animation duration in milliseconds

    _state: bool // Tracks state of the buttons. (0: closed, 1: open, 2: elevated)
    setToHidden: function() //Instantly set to hidden position without animation
    setToShown: function() //Instantly set to shown position without animation
  */
  //========== Properties ==========//
  get state(){
    return this._state;
  }
  set state(value){
    this._state = value;
  }
  //========== Functions ==========//
  setToHidden(){
    this.animate({
      translate:{
        x: 0,
        y: +this.hiddenTranslateY,
      },
      duration: +this.duration,
    });
    this. state = 0;
  }
  setToShown(){
    this.animate({
      translate:{
        x: 0,
        y: 0,
      },
      duration: +this.duration,
    });
    this.state = 1;
  }
  setToElevatedShown(){
    this.animate({
      translate:{
        x: 0,
        y: -75,
      },
      duration: +this.duration,
    });
    this.state = 2;
  }
  setToHiddenNoAnimation(){
    this.translateY = +this.hiddenTranslateY
    this.state = 0;
  }
  setToShownNoAnimation(){
    this.translateY = 0;
    this.state = 1;
  }
  // Elevated shown: buttons are placed higher (above the suspended card drawer)
  setToElevatedShownNoAnimation(){
    this.translateY = -75;
    this.state = 2;
  }
  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);
    this.hiddenTranslateY = +this.hiddenTranslateY;
    this.duration = +this.duration;

    if(this.state == 0){
      setTimeout(()=>{
        this.setToHiddenNoAnimation()
      },0);
    } else if (this.state == 1){
      setTimeout(()=>{
        this.setToShownNoAnimation()
      },0);
    } else if (this.state == 2) {
      setTimeout(()=>{
        this.setToElevatedShownNoAnimation()
      },0);
    }
  }
}

//========== View Properties ==========//
var properties = {
  hiddenTranslateY: new propertiesModule.Property({
    name: 'hiddenTranslateY',
    defaultValue: 0,
  }),
  duration: new propertiesModule.Property({
    name: 'duration',
    defaultValue: 500,
  }),
  state: new propertiesModule.Property({
    name: 'state',
    defaultValue: 0,
    valueChanged(target, oldValue, newValue){
      target.state = newValue;
    },
  }),
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(BottomFloatingButtonsContainer);
module.exports.BottomFloatingButtonsContainer = BottomFloatingButtonsContainer;
