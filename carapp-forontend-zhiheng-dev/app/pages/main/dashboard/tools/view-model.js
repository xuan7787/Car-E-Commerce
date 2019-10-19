//========== Framework Modules ==========//
var platformModule = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame"); 
var colorModule = require("tns-core-modules/color");
var dialogs = require("tns-core-modules/ui/dialogs");
var appSettings = require("application-settings");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  viewWidth: 0,

  downpayment: 0,
  sellingPrice: 32000,
  interestRate: 1.98,
  interestRateRaw: 1.98,
  loanTenture: 12,
  loanInstallment: 0,
  loanUpfront: 0,

  depreciationYearsRemaining: 1,
  depreciationYearsRemainingRaw: 1,
  arfValue: 0,
  depreciationResult: 0,
  depreciationDisplay: 0,
  depreciationPositive: false,

  downpaymentSlider: {},
  interestRateSlider: {},
  loanTentureSlider: {},
  depreciationYearsRemainingSlider: {},
  arfSlider: {},

  //========== Functions ==========//

  onPropertyChange(data){
    // Downpayment
    if(Math.ceil(this.downpayment)/100*100 == Math.ceil(this.sellingPrice/100*100)){
      this.downpayment = this.sellingPrice;
    } else {
      this.downpayment = Math.round(this.downpayment/100)*100;
    }
    this.downpaymentSlider.value = this.downpayment; // Snap the slider

    // Loan tenture
    this.loanTenture = Math.round(this.loanTenture);
    this.loanTentureSlider.value = this.loanTenture;

    // Interest Rate
    if(this.interestRateRaw < 2.38){
      this.interestRate = 1.98;
    } else if (this.interestRateRaw < 2.88){
      this.interestRate = 2.78;
    } else {
      this.interestRate = 2.98;
    }
    this.interestRateSlider.value = this.interestRate;

    // Calculate results for loan upfront
    var loanAmount = this.sellingPrice - this.downpayment;
    this.loanInstallment = Math.round((loanAmount + ((this.interestRate/100)*loanAmount*(this.loanTenture/12)))/this.loanTenture);
    this.loanUpfront = Math.round(25+this.loanInstallment+this.downpayment);

    // Depreciation years remaining
    this.depreciationYearsRemaining = Math.round(this.depreciationYearsRemainingRaw);
    this.depreciationYearsRemainingSlider.value = this.depreciationYearsRemaining;

    // ARF/OMV value
    this.arfValue = Math.round(this.arfValue/100)*100;
    this.arfSlider.value = this.arfValue;

    // Calculate results for depreciation rate
    this.depreciationResult = Math.round((this.sellingPrice - (this.arfValue / 2))/this.depreciationYearsRemaining);
    if(this.depreciationResult <= 0){
      this.depreciationPositive = true;
      this.depreciationDisplay = -this.depreciationResult;
    }
    else{
      this.depreciationPositive = false;
      this.depreciationDisplay = this.depreciationResult;
    }
  },

  //========== Handlers ==========//
  onLoaded(args){
    this.viewWidth = appSettings.getNumber("viewWidth")
    this.downpaymentSlider = args.object.getViewById("downpaymentSlider");
    this.interestRateSlider = args.object.getViewById("interestRateSlider");
    this.loanTentureSlider = args.object.getViewById("loanTentureSlider");
    this.depreciationYearsRemainingSlider = args.object.getViewById("depreciationYearsRemainingSlider");
    this.arfSlider = args.object.getViewById("arfSlider");
    this.on(observableModule.Observable.propertyChangeEvent, (data)=>{
      this.onPropertyChange(data);
    })
    this.onPropertyChange({});
  },
  onUnloaded(args){
    this.off(observableModule.Observable.propertyChangeEvent, (data)=>{
      this.onPropertyChange(data);
    })
  },
  onTapCloseButton(args){
    frameModule.getFrameById("rootFrame").goBack();
  },
  onTapSellingPriceLabel(args){
    let vm = this;
    dialogs.prompt({
      title: "Selling Price",
      message: "Enter the selling price of the car",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(isNaN(r.text) || r.text==""){
          vm.sellingPrice = 32000;
        } else {
          vm.sellingPrice = r.text;
        }
      }
    });
  },
  onTapDownpaymentValue(args){
    let vm = this;
    dialogs.prompt({
      title: "Downpayment",
      message: "Enter the downpayment",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(r.text > vm.sellingPrice){
          vm.downpayment = vm.sellingPrice;
        } else if(!isNaN(r.text)){
          vm.downpayment = r.text;
        }
      }
    });
  },
  onTapLoanAmountValue(args){
    let vm = this;
    dialogs.prompt({
      title: "Loan Amount",
      message: "Enter the loan amount",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(r.text > vm.sellingPrice){
          vm.downpayment = 0;
        } else if(!isNaN(r.text)){
          vm.downpayment = vm.sellingPrice - r.text;
        }
      }
    });
  },
  onTapLoanTentureValue(args){
    let vm = this;
    dialogs.prompt({
      title: "Loan Tenture (months)",
      message: "Enter the loan tenture period in months",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(r.text > 84){
          vm.loanTenture = 84;
        } else if(!isNaN(r.text)){
          vm.loanTenture = r.text;
        }
      }
    });
  },
  onTapDepreciationYearsRemainingValue(args){
    let vm = this;
    dialogs.prompt({
      title: "Depreciation - Years Remaining",
      message: "Enter the number of years remaining",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(r.text > 10){
          vm.depreciationYearsRemaining = 10;
        } else if(!isNaN(r.text)){
          vm.depreciationYearsRemaining = r.text;
        }
      }
    });
  },
  onTapArfValue(args){
    let vm = this;
    dialogs.prompt({
      title: "ARF/OMV",
      message: "Enter the value of ARF/OMV",
      okButtonText: "OK",
      cancelButtonText: "Cancel",
      defaultText: "",
      inputType: dialogs.inputType.decimal
    }).then(function (r){
      if(r.result){
        if(r.text > 100000){
          vm.arfValue = 100000;
        } else if(!isNaN(r.text)){
          vm.arfValue = r.text;
        }
      }
    });
  }
  
});
