var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var imageModule = require("tns-core-modules/ui/image");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class SearchCancelButton extends imageModule.Image{
  /* NOTE:
    //A button for canceling the search, inherited from Image.

    shownTranslateX: number //TranslateX to apply when showing button
    isShown: bool [get, set] //Animates the button to the shown or hidden position upon setting value
    duration: number //Transition duration in milliseconds

    _isShown: bool //Private property for tracking state of isShown

    setToShown: function() //Instantly set button to shown position without animation
    setToHidden: function() //Instantly set button to hidden position without animation
  */

  //========== Properties ==========//
  get isShown(){
    return this._isShown;
  }
  set isShown(value){
    if(this._isShown == value) return;
    this._isShown = value;

    var duration = +this.duration;
    var translateX = (value)? +this.shownTranslateX : 0;

    this.animate({
      translate: {
        x: translateX,
        y: 0,
      },
      duration: duration,
    });
  }

  //========== Functions ==========//
  setToShown(){
    this._isShown = true;

    var translateX = +this.shownTranslateX;

    this.animate({
      translate: {
        x: translateX,
        y: 0,
      },
      duration: 0,
    });
  }
  setToHidden(){
    this._isShown = true;

    var translateX = 0;

    this.animate({
      translate: {
        x: translateX,
        y: 0,
      },
      duration: 0,
    });
  }

  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);
    this.duration = +this.duration;

    setTimeout(()=>{
      this.shown ? this.setToShown() : this.setToHidden();
    }, 0);
  }
}

//========== View Properties ==========//
var properties = {
  shownTranslateX: new propertiesModule.Property({
    name: 'shownTranslateX',
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
for(var key in properties) properties[key].register(SearchCancelButton);
module.exports.SearchCancelButton = SearchCancelButton;
