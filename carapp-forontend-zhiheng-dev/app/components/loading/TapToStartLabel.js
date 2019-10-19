var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var labelModule = require("tns-core-modules/ui/label");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class TapToStartLabel extends labelModule.Label{
  /* NOTE:
    //An element for animating labels the bottom of the screen. Inherited from Label
    isShown: bool [get, set] //Animates to its shown or hidden position upon setting value
    hiddenTranslateY: number //Amount of translateY to apply when hiding
    duration: number //Animation duration in milliseconds

    _isShown: bool //Tracks value of isShown property
    setToHidden: function() //Instantly set to hidden position without animation
    setToShown: function() //Instantly set to shown position without animation
  */
  //========== Properties ==========//
  get isShown(){
    return this._isShown;
  }
  set isShown(value){
    this._isShown = value;

    var translateY = value ? 0 : +this.hiddenTranslateY;
    var duration = +this.duration;

    this.animate({
      translate:{
        x: 0,
        y: translateY,
      },
      duration: duration,
    });
  }
  //========== Functions ==========//
  setToHidden(){
    this._isShown = false;

    this.translateY = +this.hiddenTranslateY
  }
  setToShown(){
    this._isShown = true;

    this.translateY = 0;
  }
  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);

    setTimeout(()=>{
      this.shown ? this.setToShown() : this.setToHidden();
    }, 0);
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
  shown: new propertiesModule.Property({
    name: 'shown',
    defaultValue: true,
    valueChanged(target, oldValue, newValue){
      target.isShown = newValue;
    },
  }),
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(TapToStartLabel);
module.exports.TapToStartLabel = TapToStartLabel;
