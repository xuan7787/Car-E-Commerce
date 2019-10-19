var platform = require("platform");
var stackLayoutModule = require("tns-core-modules/ui/layouts/stack-layout");
var propertiesModule = require("tns-core-modules/ui/core/properties");
var ticker = require("~/modules/ticker");

class NumberWheelContainer extends stackLayoutModule.StackLayout{
  /* NOTE:
    //Stack Layout containing the labels displaying a column of number digits
    endPointTranslateY: number //TranslateY to animate to before looping back to the original position
    duration: number //Time taken in milliseconds to complete one cycle
    loadCompleteBaseSpeedMultiplier: //Multiplies the base speed by this number upon loading complete
    targetDigit: number //The number to stop the wheel at upon load complete
    isLoadComplete: bool//To determine whether the number wheel should stop at the target digit

    animationComplete: function() //Callback upon completing wheel stopping when animation is complete

    _positionRatio: number //Value tracking position of number wheel, with 0 representing the origin, and 1 representing the end point

  */
  //========== Handlers ==========//
  onLoaded(){
    super.onLoaded();

    //Set up tick event handler
    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);

    this.endPointTranslateY = +this.endPointTranslateY;
    this.duration = +this.duration;
    this.loadCompleteBaseSpeedMultiplier = +this.loadCompleteBaseSpeedMultiplier;
    this.targetDigit = +this.targetDigit;

    this.isLoadComplete = false;

    this._positionRatio = 0;

  }
  onUnloaded(){
    super.onUnloaded();

    ticker.removeFromNotificationList(this);
    this.off(ticker.tickEvent, this.onTick, this);
  }
  onTick(args){
    var deltaTime = args.deltaTime;
    var duration = this.duration;

    if(!this.isLoadComplete){
      this._positionRatio += deltaTime / duration;  //calculate increment of position ratio
    } else {
      var targetPositionRatio = this.targetDigit / 10;

      if(targetPositionRatio == this._positionRatio){
        if(!this._wasAnimationComplete){
          this.animationComplete && this.animationComplete();
        }
        this._wasAnimationComplete = true;
        return;
      } else {
        this._wasAnimationComplete = false;
      }

      var positionRatioRemaining = targetPositionRatio - this._positionRatio;
      var loadCompleteBaseSpeedMultiplier = +this.loadCompleteBaseSpeedMultiplier;

      if(positionRatioRemaining < 0){
        positionRatioRemaining++;

        this._positionRatio = Math.min(
          targetPositionRatio + 1,
          this._positionRatio + (deltaTime / duration) * loadCompleteBaseSpeedMultiplier,
          this._positionRatio + positionRatioRemaining / 20,
        );
      } else {
        this._positionRatio = Math.min(
          targetPositionRatio,
          this._positionRatio + (deltaTime / duration) * loadCompleteBaseSpeedMultiplier,
          this._positionRatio + (deltaTime / duration) / 8 + (positionRatioRemaining / 20),
        );
      }

    }
    this._positionRatio %= 1;                                     //loop value back to a range between 0 and 1
    this.translateY = this._positionRatio * this.endPointTranslateY;
  }
}

//========== View Properties ==========//
var properties = {
  endPointTranslateY: new propertiesModule.Property({
    name: 'endPointTranslateY',
    defaultValue: 0,
  }),
  duration: new propertiesModule.Property({
    name: 'duration',
    defaultValue: 500,
  }),
  targetDigit: new propertiesModule.Property({
    name: 'targetDigit',
    defaultValue: 8,
  }),
  loadCompleteBaseSpeedMultiplier: new propertiesModule.Property({
    name: 'loadCompleteBaseSpeedMultiplier',
    defaultValue: 1,
  }),
  isLoadComplete: new propertiesModule.Property({
    name: 'isLoadComplete',
    defaultValue: false,
  }),

  animationComplete: new propertiesModule.Property({
    name: 'animationComplete',
    defaultValue: ()=>{},
  }),
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(NumberWheelContainer);
module.exports.NumberWheelContainer = NumberWheelContainer;
