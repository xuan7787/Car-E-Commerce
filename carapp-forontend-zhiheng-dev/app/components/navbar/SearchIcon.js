var ticker = require("~/modules/ticker");

var platformModule = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var imageModule = require("tns-core-modules/ui/image");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class SearchIcon extends imageModule.Image{
  /* NOTE:
    //A button for canceling the search, inherited from Image.

    shiftedTranslateX: number //TranslateX to apply when shifting button
    isExpanded: bool [get, set] //Animates the button to the target position upon changing value
    duration: number //Transition duration in milliseconds

    _isExpanded: bool //Private property for tracking state of isExpanded

    setToShifted: function() //Instantly set button to shifted position without animation
    setToOrigin: function() //Instantly set button to original position without animation
  */
  //========== Properties ==========//
  get isExpanded(){
    return this._isExpanded;
  }
  set isExpanded(value){
    this._isExpanded = value;
  }

  //========== Functions ==========//
  setToExpanded(){
    this._isExpanded = true;
    this.marginLeft = this.expandedMarginLeft;
  }
  setToContracted(){
    this._isExpanded = false;
    this.marginLeft = this.expandedMarginLeft + this._contractedDeltaMarginLeft;
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);
    this.duration = +this.duration;
    this.searchFieldMarginLeft = +this.searchFieldMarginLeft;
    this.searchFieldMarginRight = +this.searchFieldMarginRight;

    this.expandedMarginLeft = +this.expandedMarginLeft;

    var placeholderWidth = 50;
    this._contractedDeltaMarginLeft = (platformModule.screen.mainScreen.widthDIPs - this.searchFieldMarginLeft - this.searchFieldMarginRight - placeholderWidth) / 2 - this.expandedMarginLeft;

    this._transformationRatio = 0;

    setTimeout(()=>{
      this.expanded ? this.setToExpanded() : this.setToContracted();
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
    if(this._isExpanded){
      if(this._transformationRatio == 1) return;
      this._transformationRatio = Math.min(1, this._transformationRatio + (args.deltaTime / this.duration));
    } else {
      if(this._transformationRatio == 0) return;
      this._transformationRatio = Math.max(0, this._transformationRatio - (args.deltaTime / this.duration));
    }
    this.marginLeft = this.expandedMarginLeft + this._contractedDeltaMarginLeft * (1 - this._transformationRatio);
  }
}

//========== View Properties ==========//
var properties = {
  expandedMarginLeft: new propertiesModule.Property({
    name: 'expandedMarginLeft',
    defaultValue: 0,
  }),
  searchFieldMarginLeft: new propertiesModule.Property({
    name: 'searchFieldMarginLeft',
    defaultValue: 0,
  }),
  searchFieldMarginRight: new propertiesModule.Property({
    name: 'searchFieldMarginRight',
    defaultValue: 0,
  }),
  duration: new propertiesModule.Property({
    name: 'duration',
    defaultValue: 500,
  }),
  expanded: new propertiesModule.Property({
    name: 'expanded',
    defaultValue: false,
    valueChanged(target, oldValue, newValue){
      target.isExpanded = newValue;
    },
  }),
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(SearchIcon);
module.exports.SearchIcon = SearchIcon;
