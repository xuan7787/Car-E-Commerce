var platform = require("platform");
var gesturesModule = require("tns-core-modules/ui/gestures");
var absoluteLayoutModule = require("tns-core-modules/ui/layouts/absolute-layout");
var propertiesModule = require("tns-core-modules/ui/core/properties");

class _TEMPLATE_COMPONENT extends absoluteLayoutModule.AbsoluteLayout{
  //========== Handlers ==========//
  onLoaded(args){
    super.onLoaded(args);//super.onLoaded must be called in this method

  }
  onUnloaded(args){
    super.onUnloaded(args); //super.onUnloaded must be called in this method

  }
}
//========== View Properties ==========//
var properties = {
  property1: new propertiesModule.Property({
    name: 'propertyName',
    defaultValue: 0,
  }),
}

//========== Initialize ==========//
for(var key in properties) properties[key].register(_TEMPLATE_COMPONENT);
module.exports._TEMPLATE_COMPONENT = _TEMPLATE_COMPONENT;
