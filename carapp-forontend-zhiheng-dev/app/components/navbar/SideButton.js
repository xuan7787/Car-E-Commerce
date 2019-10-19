var ticker = require("~/modules/ticker");

var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var imageModule = require("tns-core-modules/ui/image");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class SideButton extends imageModule.Image{
  //========== Properties ==========//
  get isShown(){
    return this._isShown;
  }
  set isShown(value){
    this._isShown = value;
  }

  //========== Functions ==========//
  setToShown(){
    this._isShown = true;
    this.translateX = 0;
  }
  setToHidden(){
    this._isShown = false;
    this.translateX = +this.hiddenTranslateX;
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);
    this.duration = +this.duration;
    this.hiddenTranslateX = +this.hiddenTranslateX;

    this._shiftRatio = 0;

    setTimeout(()=>{
      this.shown ? this.setToShown() : this.setToHidden();
    }, 0);

    //Set up tick event handler
    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);
  }
  onUnloaded(args){
    super.onUnloaded(args);
    ticker.removeFromNotificationList(this);
    this.off(ticker.tickEvent, this.onTick, this);
  }
  onTick(args){
    if(this._isShown){
      if(this._shiftRatio == 0) return;
      this._shiftRatio = Math.max(0, this._shiftRatio - (args.deltaTime / this.duration));
    } else {
      if(this._shiftRatio == 1) return;
      this._shiftRatio = Math.min(1, this._shiftRatio + (args.deltaTime / this.duration));
    }
    this.translateX = this.hiddenTranslateX * this._shiftRatio;
  }
}

//========== View Properties ==========//
var properties = {
  hiddenTranslateX: new propertiesModule.Property({
    name: 'hiddenTranslateX',
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
for(var key in properties) properties[key].register(SideButton);
module.exports.SideButton = SideButton;
