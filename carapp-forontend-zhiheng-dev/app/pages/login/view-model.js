//========== App Modules =========//
var server = require("~/modules/server");
var datastore = require("~/modules/datastore");

//========== Framework Modules ==========//
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var httpModule = require("http");
var dialogs = require("tns-core-modules/ui/dialogs");
var LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
var LoadingIndicatorMode = require('@nstudio/nativescript-loading-indicator').Mode;
const loader = new LoadingIndicatorModule();

const loadingIndicatorOptions = {
  message: "Logging in...",
  details: "",
  progress: 0.65,
  margin: 10,
  dimBackground: true,
  color: "#111",
  backgroundColor: "#e6e6e6",
  hideBezel: false,
  mode: LoadingIndicatorMode.Indeterminate,
  // ios:{
  //   view: UIView,
  // }
}

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  identityInput: "user@gmail.com",
  passwordInput: "user",

  isLoggingIn: false,//Disable login button when set to true
  //========== Functions ==========//

  onTapDisabledButton(args){
    alert("This button is disabled.");
  },

  //========== Handlers ==========//
  onLoaded(args){

  },
  onTapLoginButton(args){
    this.onLoginAsync();
  },
  onTapForgotPasswordButton(args){
    this.onTapDisabledButton(args);
  },
  onTapEmailSignup(args){
    frameModule.topmost().navigate({
      moduleName: "pages/signup/page",
      clearHistory: false,
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
  },
  onTapFacebookSignup(args){
    this.onTapDisabledButton(args);
  },
  onTapPhoneSignup(args){
    frameModule.topmost().navigate({
      moduleName: "pages/signup_phone/page",
      clearHistory: false,
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
  },
  onTapStartBrowsing(args){
    this.onTapDisabledButton(args);
  },

  async onLoginAsync(){
    console.log("Logging "+this.isLoggingIn);
    try{
      if(this.isLoggingIn) return;//Do not run function if is currently logging in

      this.isLoggingIn = true;
      loader.show(loadingIndicatorOptions);

      var response = await server.login({
        email: this.identityInput,
        password: this.passwordInput,
      });

      

      if(response.errors){//Login unsuccessful
        console.log(response);
        loader.hide();
        this.isLoggingIn = false;
        dialogs.alert(response.message);
      } else {//Login successful
        console.log(response);
        loader.hide();
        datastore.loginToken = response["token"];

        frameModule.topmost().navigate({
          moduleName: "pages/welcome/page",
          clearHistory: false,
          animated: true,
          transition: {
            name: "slideLeft",
          },
        });
      }
      this.isLoggingIn = false;
    } catch(error){
      loader.hide();
      this.isLoggingIn = false;
      console.log(error);
    }
  },
});
