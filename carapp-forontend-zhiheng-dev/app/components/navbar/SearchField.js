var ticker = require("~/modules/ticker");

var platformModule = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var textFieldModule = require("tns-core-modules/ui/text-field");
var propertiesModule = require("tns-core-modules/ui/core/properties");


class SearchField extends textFieldModule.TextField{
  /* NOTE:
    //The search bar on the navbar, inherited from TextField.

    expandedDeltaX: number //Delta of X applied upon expanding search bar
    expandedDeltaWidth: number //Delta of width applied upon expanding search bar
    expandedDeltaPaddingLeft: number/Delta of padding left applied upon expanding search bar
    duration: number //Transition duration in milliseconds
    isExpanded: bool [get, set] //Animates the search bar to its expanded or contracted state upon change

    _isExpanded: bool //Private property for tracking state of isExpanded
    _initialWidth: number //Stores the initial width value of the search field

    setToExpanded: function() //Instantly set button to expanded state without animation
    setToContracted: function() //Instantly set button to contracted state without animation
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

    this.marginLeft = this._initialMarginLeft + this.expandedDeltaMarginLeft;
    this.marginRight = this._initialMarginLeft + this.expandedDeltaMarginLeft;

    this.paddingLeft = this.expandedPaddingLeft;
  }
  setToContracted(){
    this._isExpanded = false;

    this.marginLeft = this._initialMarginLeft;
    this.marginRight = this._initialMarginLeft;

    this.paddingLeft = this.expandedPaddingLeft + this._contractedDeltaPaddingLeft;
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);

    this.expandedDeltaMarginLeft = +this.expandedDeltaMarginLeft;
    this.expandedDeltaMarginRight = +this.expandedDeltaMarginRight;
    this.duration = +this.duration;

    if(!this.isExpanded){
      this._initialMarginLeft = +this.marginLeft;
      this._initialMarginRight = +this.marginRight;

      this.expandedPaddingLeft = +this.expandedPaddingLeft;
    }

    var placeholderWidth = 50;
    this._contractedDeltaPaddingLeft = (platformModule.screen.mainScreen.widthDIPs - this._initialMarginLeft - this._initialMarginRight - placeholderWidth) / 2 - this.expandedPaddingLeft;

    this._transformationRatio = 0;

    setTimeout(()=>{
      this.isExpanded ?  this.setToExpanded() : this.setToContracted();
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

    this.marginLeft = this._initialMarginLeft + (this.expandedDeltaMarginLeft * this._transformationRatio);
    this.marginRight = this._initialMarginRight + (this.expandedDeltaMarginRight * this._transformationRatio);

    this.paddingLeft = this.expandedPaddingLeft + (this._contractedDeltaPaddingLeft * (1 - this._transformationRatio));
  }
}

//========== View Properties ==========//
var properties = {
  expandedDeltaMarginLeft: new propertiesModule.Property({
    name: 'expandedDeltaMarginLeft',
    defaultValue: 0,
  }),
  expandedDeltaMarginRight: new propertiesModule.Property({
    name: 'expandedDeltaMarginRight',
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
for(var key in properties) properties[key].register(SearchField);
module.exports.SearchField = SearchField;
