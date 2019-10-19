var ticker = require("~/modules/ticker");

var platformModule = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var propertiesModule = require("tns-core-modules/ui/core/properties");
var gridLayoutModule = require("tns-core-modules/ui/layouts/grid-layout");


class SubmitButton extends gridLayoutModule.GridLayout{
  /* NOTE:
    //The submit button on the singup page

    expandedDeltaX: number //Delta of X applied upon expanding search bar
    expandedDeltaWidth: number //Delta of width applied upon expanding search bar
    expandedDeltaPaddingLeft: number/Delta of padding left applied upon expanding search bar
    duration: number //Transition duration in milliseconds
    isExpanded: bool [get, set] //Animates the search bar to its expanded or contracted state upon change

    _isCompressed: bool //Private property for tracking state of isCompressed
    _initialWidth: number //Stores the initial width value of the search field

    setToExpanded: function() //Instantly set button to expanded state without animation
    setToContracted: function() //Instantly set button to contracted state without animation
  */

  //========== Properties ==========//
  get state(){
    return this._state;
  }
  set state(value){
    this._state = value;
  }

  //========== Functions ==========//
  setToLoading(){
    this.state = 1;
    console.log("setting to loading");
  }
  setToSuccess(){
    this.state = 2;
    console.log("setting to success");
  }
  setToDefault(){
    this.state = 0;
    console.log("reverting to default");
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);
    this.duration = +this.duration;
    this.width = this.getActualSize().width;

    this._contractedWidth = this.height;
    this._widthChange = this.width - this.height;

    this._initialBorderRadius = this.borderRadius;
    this._borderRadiusChange = this.height - this.borderRadius;

    // Hard coded rgb values for now
    this._initialColorGradient = [[255,65,95], [248,113,146]];
    this._currentColorGradient = [[255,65,95], [248,113,146]];
    this._colorGradientChange = [[-91,149,-31], [-84,101,-82]];

    this._widthTransformationRatio = 1;
    this._borderRadiusTransformationRatio = 0;
    this._colorTransformationRatio = 0;

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
    if(this.state == 1){
      // Set button to loading
      if(this._widthTransformationRatio == 0 && this._borderRadiusTransformationRatio == 1) return;
      this._widthTransformationRatio = Math.max(0, this._widthTransformationRatio - (args.deltaTime / this.duration));
      this._borderRadiusTransformationRatio = Math.min(1, this._borderRadiusTransformationRatio + (args.deltaTime / this.duration));
    } else if (this.state == 0){
      if(this._widthTransformationRatio == 1 && this._borderRadiusTransformationRatio == 0) return;
      this._widthTransformationRatio = Math.min(1, this._widthTransformationRatio + (args.deltaTime / this.duration));
      this._borderRadiusTransformationRatio = Math.max(0, this._widthTransformationRatio - (args.deltaTime / this.duration));
    } else if (this.state == 2){
      if(this._colorTransformationRatio == 1) return;
      this._colorTransformationRatio = Math.min(1, this._colorTransformationRatio + (args.deltaTime / this.colorChangeDuration));
    }

    this.width = this._contractedWidth + (this._widthChange * this._widthTransformationRatio)
    this.borderRadius = this._initialBorderRadius + (this._borderRadiusChange * this._borderRadiusTransformationRatio);
    for(var i=0; i<2; i++){
      for(var j=0; j<3; j++){
        this._currentColorGradient[i][j] = this._initialColorGradient[i][j] + (this._colorGradientChange[i][j] * this._colorTransformationRatio);
      }
    }
    this.background="linear-gradient(to right, rgb("
    +Math.round(this._currentColorGradient[0][0].toString())+","
    +Math.round(this._currentColorGradient[0][1].toString())+","
    +Math.round(this._currentColorGradient[0][2].toString())+"), rgb("
    +Math.round(this._currentColorGradient[1][0].toString())+","
    +Math.round(this._currentColorGradient[1][1].toString())+","
    +Math.round(this._currentColorGradient[1][2].toString())+"))";
  }
}

//========== View Properties ==========//
var properties = {
  duration: new propertiesModule.Property({
    name: 'duration',
    defaultValue: 350,
  }),
  colorChangeDuration: new propertiesModule.Property({
    name: 'colorChangeDuration',
    defaultValue: 200,
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
for(var key in properties) properties[key].register(SubmitButton);
module.exports.SubmitButton = SubmitButton;
