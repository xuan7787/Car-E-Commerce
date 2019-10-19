//========== App Modules =========//
var server = require("~/modules/server");
var ticker = require("~/modules/ticker");

//========== Framework Modules ==========//
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var dialogs = require("tns-core-modules/ui/dialogs");

var zxcvbn = require("zxcvbn");
var LoadingIndicatorModule = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
var LoadingIndicatorMode = require('@nstudio/nativescript-loading-indicator').Mode;
const loader = new LoadingIndicatorModule();

const loadingIndicatorOptions = {
  message: "Verifying code...",
  details: "",
  progress: 0.65,
  margin: 10,
  dimBackground: true,
  color: "#111",
  backgroundColor: "#e6e6e6",
  hideBezel: false,
  mode: LoadingIndicatorMode.Indeterminate,
}

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  usernameInput: "myUsername",
  phoneNumberInput: "83123456",
  passwordInput: "password",
  passwordReentryInput: "password",

  inputFields: [],
  verifyPhoneNumberInputFields: [], // 6 digit phone verification code input

  passwordInputField: {},
  passwordStrengthBar: {},
  passwordStrengthLabel: {},
  passwordStrengthSection: {},
  signupSuccessMessageSection: {},
  submitButton: {},
  hiddenTextField: {},

  isSigningUp: false,
  sentConfirmationSMS: false,
  confirmPhoneNumberSectionsOpacity: 0, // Affects success message & verification code input sections
  //========== Functions ==========//
  unfocusInput(){
    this.hiddenTextField.focus();
    this.hiddenTextField.dismissSoftInput();
  },

  onPasswordInputChangeHandler(){
    // Update password strength bar & warning text
    setTimeout(()=>{
      var zxcvbnResult = zxcvbn(this.passwordInput)
      this.passwordStrengthBar.value = zxcvbnResult.score;
      if(zxcvbnResult.feedback.warning == ""){ // No warning generated from zxcvbn
        // Reset text & styling
        this.passwordStrengthLabel.text = "Password Strength";
        this.passwordStrengthLabel.color = "darkgray";
      } else {
        this.passwordStrengthLabel.text = zxcvbnResult.feedback.warning;
        this.passwordStrengthLabel.color = "red";
      }
    }, 20)
  },

  onVerifyPhoneNumberInputChangeHandler(args){
    if(args.value.length == 1){
      for(var i=0; i<5; i++){
        if(this.verifyPhoneNumberInputFields[i] == args.object){
          setTimeout(()=>{
            this.verifyPhoneNumberInputFields[i+1].focus();
          },5);
          return;
        }
      }
      setTimeout(()=>{
        this.unfocusInput();
        this.submitVerificationCode();
      },5);
    }
    else {
      for(var i=5; i>0; i--){
        if(this.verifyPhoneNumberInputFields[i] == args.object){
          setTimeout(()=>{
            this.verifyPhoneNumberInputFields[i-1].focus();
          },5);
          return;
        }
      }
    }
  },

  submitVerificationCode(){
    // Show loading indicator first
    loader.show(loadingIndicatorOptions);
    setTimeout(()=>{
      loader.hide()
      alert("The account creation feature is currently not completed & still in progress.");
    }, 500)
  },

  setSubmitButtonToLoading(){
    this.submitButton.setToLoading();

    // Disable all the fields
    this.inputFields.forEach((inputField)=>{
      inputField.editable = "false";
      inputField.color = "gray";
    })

    setTimeout(()=>{
      this.submitButton.getViewById("submitButtonArrow").visibility = "collapsed";
      this.submitButton.getViewById("submitActivityIndicator").busy = "true";
    }, 220);

    setTimeout(()=>{
      this.setSubmitButtonToSuccess();
    }, 1400);
  },

  setSubmitButtonToSuccess(){
    this.submitButton.setToSuccess();
    this.submitButton.getViewById("submitActivityIndicator").busy = "false";
    this.submitButton.getViewById("submitButtonTick").visibility = "visible";
    this.passwordStrengthSection.visibility = "collapsed";
    this.signupSuccessMessageSection.visibility = "visible";
    this.sentConfirmationSMS = true;
  },

  //========== Handlers ==========//
  onLoaded(args){
    alert("Note: This page is still not functional yet!");
    this.inputFields.push(args.object.getViewById("usernameField"));
    this.inputFields.push(args.object.getViewById("phoneNumberField"));
    this.inputFields.push(args.object.getViewById("passwordField"));
    this.inputFields.push(args.object.getViewById("confirmPasswordField"));

    this.passwordInputField = args.object.getViewById("passwordField");
    this.passwordStrengthBar = args.object.getViewById("passwordStrengthBar");
    this.passwordStrengthLabel = args.object.getViewById("strengthLabel");
    this.passwordStrengthSection = args.object.getViewById("passwordStrengthSection");
    this.signupSuccessMessageSection = args.object.getViewById("successMessageSection")
    this.submitButton = args.object.getViewById("submitButton");
    this.hiddenTextField = args.object.getViewById("hiddenTextField");

    for(var i=0; i<6; i++){
      this.verifyPhoneNumberInputFields.push(args.object.getViewById("verifyPhoneNumberInput"+i.toString()));
      console.log(this.verifyPhoneNumberInputFields[i]);
      this.verifyPhoneNumberInputFields[i].on("textChange", this.onVerifyPhoneNumberInputChangeHandler, this);
    }

    this.passwordInputField.on("textChange", this.onPasswordInputChangeHandler, this);
    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);
  },
  onUnloaded(args){
    this.passwordInputField.off("textChange", this.onPasswordInputChangeHandler, this);
    ticker.removeFromNotificationList(this);
    this.off(ticker.tickEvent, this.onTick, this);
  },
  onTick(args){
    if(this.sentConfirmationSMS){
      // Once verification SMS sent, set SMS verification sections to fade in
      if(this.confirmPhoneNumberSectionsOpacity == 1) return;
      this.confirmPhoneNumberSectionsOpacity = Math.min(1, this.confirmPhoneNumberSectionsOpacity
        + (args.deltaTime/ 500));
    }
  },
  onTapCancelButton(args){
    // TODO: Cleanup repeated code
    if(this.sentConfirmationSMS){
      dialogs.confirm({
        title: "Cancellation of Registration",
        message: "Your registration has not been completed. Do want to cancel your registration?",
        okButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result)=>{
        console.log("Confirm registration cancel: "+result);
        if(result){
          frameModule.topmost().navigate({
            moduleName: "pages/login/page",
            clearHistory: true,
            animated: true,
            transition: {
              name: "slideRight",
            },
          });
        }
      })
    }
    else{
      frameModule.topmost().navigate({
        moduleName: "pages/login/page",
        clearHistory: true,
        animated: true,
        transition: {
          name: "slideRight",
        },
      });
    }
  },
  onTapKeyboardNext(args){
    // Bad codin
  },
  onTapSubmitButton(args){
    if(this.submitButton.state == 0){ // Check whether it is still in initial expanded state
      this.setSubmitButtonToLoading();
    }
    // this.onSignUpAsync();
  },

  async onSignUpAsync(){
    try{
      if(this.isSigningUp) return;//Do not run function if is currently logging in

      this.isSigningUp = true;

      var response = await server.register({
        username: this.usernameInput,
        mobile_number: this.phoneNumberInput,
        password: this.passwordInput,
        passwordConfirmation: this.passwordReentryInput,
        firstName: "First Name",
        lastName: "Last Name",
        profileImg: "",
      });

      this.isSigningUp = false;

      if(response.error){
        dialogs.alert("Thou hast Failed To Register");
      } else {
        dialogs.alert(response.state);
      }

      console.log(response);
    } catch(error){
      console.log(error);
    }
    /*
    if(response.errors){//Login unsuccessful
      console.log(response);
    } else {//Login successful
      console.log(response);
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
    */
  },
});
