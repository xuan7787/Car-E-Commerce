//========== App Modules ==========//
var enums = require("~/modules/enums");
var datastore = require("~/modules/datastore");
var server = require("~/modules/server")
var ticker = require("~/modules/ticker")

//========== Framework Modules ==========//
var platformModule = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var imageSourceModule = require("tns-core-modules/image-source");
var dialogs = require("tns-core-modules/ui/dialogs");
var appSettings = require("application-settings");
var Color = require("color").Color;
var moment = require("moment");
var seedrandom = require('seedrandom');
var photoViewerModule = require("nativescript-photoviewer");
var photoViewer;
var clipboard = require("nativescript-clipboard");
var calendarModule = require("nativescript-calendar");
var calendarDisplayModule = require("nativescript-ui-calendar");
var ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;

var picker = new ModalPicker();

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  carImageSrc: "~/images/graphics/image_placeholder_caratmbs.jpg",
  senderImage: "~/images/graphics/image_placeholder_leekam.png",
  carPosting: {},
  sellerInfo: {},
  timestampString: "",
  registrationDateString: "",
  monthsToCoeExpiry: 12,
  carDepreciationValue: 0,

  bottomCardDrawer: {},
  messagesListView: {},
  drawerCalendar: {},
  bottomFloatingButtons: {},
  depreciationData: [],
  marketComparisonData: [],
  currentCarPriceData: [],

  viewWidth: 0,

  selectedCarModification: "",
  carModificationDoors: {},
  carModificationWheels: {},
  carModificationWindows: {},
  carModificationBacklights: {},
  carModificationBody: {},
  carModificationBase: {},
  carModificationAnimationTime: 150, // in milliseconds
  hiddenTextField: {},

  // Loan Calculator variables
  downpayment: 0,
  sellingPrice: 32000,
  interestRate: 1.98,
  interestRateRaw: 1.98,
  loanTenture: 12,
  maxLoanTenture: 0,
  loanInstallment: 0,
  loanUpfront: 0,

  downpaymentSlider: {},
  interestRateSlider: {},
  loanTentureSlider: {},

  showBottomFloatingButtons: false,

  drawerState: 2,
  messagesData: new observableArrayModule.ObservableArray(),
  calendarEventsData: new observableArrayModule.ObservableArray(), // For list of events below calendar
  calendarEventsDisplayData: new observableArrayModule.ObservableArray(), // For in-calendar dots
  selectedDrawerTab: 0, // 0: Chat, 1: Calendar
  calendarVenueInput: "",
  calendarNotesInput: "",
  calendarAgendaInput: "",
  calendarTimeLabel: "",
  selectedCalendarDate: new Date(),
  selectedCalendarDateNumberDisplay: new Date().getDate(),
  selectedCalendarHour: 0,
  selectedCalendarMinute: 0,
  calendarEventsHeight: 0,
  ignoreCalendarDateChange: false,

  //========== Functions ==========//
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  buildTimestampString(){
    this.timestampString =
      "listed " + moment(this.carPosting.created_at).fromNow()+
      ". updated " + moment(this.carPosting.updated_at).fromNow()
  },
  buildRegistrationDateString(){
    this.registrationDateString = "Reg " + moment(this.carPosting.registration_date).format('D MMM YYYY');
  },
  calculateMaxLoanTenture(){
    var currentDate = new Date();
    var coeExpiryDate = new Date(this.carPosting.coe_expiry_date.substring(0,4),
      this.carPosting.coe_expiry_date.substring(5,7)-1,
      this.carPosting.coe_expiry_date.substring(8,10));
    console.log(currentDate.valueOf());
    var diffTime = Math.abs(coeExpiryDate.getTime() - currentDate.getTime());
    var diffMonths = Math.ceil(diffTime / (1000*60*60*24*30.5));
    console.log(diffTime);
    if(diffMonths < 12){
      this.maxLoanTenture = 12;
    } else if(diffMonths > 84){
      this.maxLoanTenture = 84;
    } else {
      this.maxLoanTenture = diffMonths;
    }
    this.monthsToCoeExpiry = diffMonths;
  },
  calculateCarDepreciationValue(){
    var carRegistrationDate = new Date(this.carPosting.registration_date.substring(0,4),
      this.carPosting.registration_date.substring(5,7)-1,
      this.carPosting.registration_date.substring(8,10));
    if(carRegistrationDate < new Date(2012, 2, 1)){
      console.log("Using OMV for calculation of car depreciation");
      this.carDepreciationValue = Math.round((this.carPosting.price - this.carPosting.omv/2)/this.monthsToCoeExpiry);
    } else {
      console.log("Using ARF for calculation of car depreciation");
      this.carDepreciationValue = Math.round((this.carPosting.price - this.carPosting.arf/2)/this.monthsToCoeExpiry);
    }
    var currentYear = new Date().getFullYear();
    var currentPrice = this.carPosting.price;
    var tempDepreciationData = []
    for(var i=0; i<6; i++){
      tempDepreciationData.push({
        year: currentYear,
        value: currentPrice,
      });
      currentYear += 1;
      currentPrice -= this.carDepreciationValue;
      if(currentPrice < 0) currentPrice = 0;
    }
    this.depreciationData = tempDepreciationData;
  },
  seedMarketComparisonData(){
    var marketComparisonRng = new seedrandom(this.carPosting.created_at);
    var tempMarketComparisonData = [];
    for(var i=0; i<20; i++){
      tempMarketComparisonData.push({})
    }

    var carPostingCreationDate = new Date(this.carPosting.created_at.substring(0,4),
      this.carPosting.created_at.substring(5,7)-1,
      this.carPosting.created_at.substring(8,10));
    console.log("carPostingCreationDate");
    this.currentCarPriceData = [{
      timestamp: (carPostingCreationDate.getTime()/100000) - 15566400,
      price: this.carPosting.price
    }];
    this.marketComparisonData = [{
      timestamp: 22000,
      price: 80000
    },
    {
      timestamp: 25000,
      price: 75000
    },
    {
      timestamp: 32300,
      price: 50000
    },
    {
      timestamp: 38600,
      price: 60500
    },
    {
      timestamp: 41000,
      price: 55030
    },
    {
      timestamp: 56000,
      price: 120000
    },
    {
      timestamp: 62800,
      price: 54300
    },
    {
      timestamp: 71400,
      price: 84000
    },
    {
      timestamp: 79500,
      price: 53000
    },
    {
      timestamp: 87100,
      price: 78400
    },
    {
      timestamp: 92300,
      price: 56000
    },] 
    console.log(JSON.stringify(this.currentCarPriceData));
    console.log("it probably crashed here");
  },
  seedMessages(){
    var tempData = []
    tempData.push({
        sent: false,
        content: "Lorem ipsum dolor sit amet",
        datetime: moment().hour(22).minute(31).format('HH:mm'),
    });
    tempData.push({
      sent: true,
      content: "Lorem ipsum dolor sit amet, adipiscing elit, sed do eius",
      datetime: moment().hour(22).minute(32).format('HH:mm'),
    });
    tempData.push({
      sent: false,
      content: "Viewing Session at 4 August 2018 — 2pm - 3pm",
      datetime: moment().hour(22).minute(34).format('HH:mm'),
    });
    this.messagesData = new observableArrayModule.ObservableArray(tempData);
  },
  getCalendarEventsForMonth(month, year){
    this.calendarEventsData = new observableArrayModule.ObservableArray();
    this.calendarEventsDisplayData = new observableArrayModule.ObservableArray();
    var startDate = new Date(); // Set to first day of month 00:00:00
    startDate.setFullYear(year);
    startDate.setMonth(month);
    startDate.setDate(1);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    var endDate = new Date(); // Set to last day of month 23:59:59
    endDate.setFullYear(year);
    endDate.setMonth(month+1);
    endDate.setDate(0);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    console.log("Retrieving calendar events between dates:");
    console.log(startDate);
    console.log(endDate);
    var options = {
      startDate: startDate,
      endDate: endDate
    }

    var appEvents = []; // Array to store only the relevant events
    var displayData = [];
    let vm = this;
    calendarModule.findEvents(options).then((events)=>{
      events.forEach((e)=>{
        if(e.calendar.name == "SquareApp Calendar"){
          startTime = moment(e.startDate).format("h:mm a");
          endTime = moment(e.endDate).format("h:mm a");
          e.timeString = startTime+" - "+endTime;
          e.dateNumber = e.startDate.getDate();
          appEvents.push(e);
          var displayEvent = new calendarDisplayModule.CalendarEvent("Car Viewing", e.startDate, e.endDate, false, new Color("#FF415F"));
          displayData.push(displayEvent);
        }
      });

      vm.calendarEventsDisplayData = new observableArrayModule.ObservableArray(displayData);
      vm.calendarEventsHeight = appEvents.length * 80;
      vm.calendarEventsData = new observableArrayModule.ObservableArray(appEvents);
    });
  },
  galleryLoaded() {
    console.log("gallery loaded...");
    // if (pageModule.isIOS && mySpinner)
    //     mySpinner.busy = false;
  },
  closeKeyboard() {
    this.hiddenTextField.focus();
    this.hiddenTextField.dismissSoftInput();
  },
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
  },

  //========== Handlers ==========//
  onLoaded(args){
    this.getCarPostingAsync();
    this.hiddenTextField = args.object.getViewById("hiddenTextField");
    this.bottomCardDrawer = args.object.getViewById("BottomCardDrawer");
    this.drawerCalendar = args.object.getViewById("drawerCalendar");
    this.messagesListView = args.object.getViewById("messagesListView");
    this.bottomFloatingButtons = args.object.getViewById("bottomFloatingButtons");

    this.carModificationBase = args.object.getViewById("carModificationBase");
    this.carModificationWheels = args.object.getViewById("carModificationWheels");
    this.carModificationBody = args.object.getViewById("carModificationBody");
    this.carModificationDoors = args.object.getViewById("carModificationDoors");
    this.carModificationWindows = args.object.getViewById("carModificationWindows");
    this.carModificationBacklights = args.object.getViewById("carModificationBacklights");

    this.downpaymentSlider = args.object.getViewById("downpaymentSlider");
    this.interestRateSlider = args.object.getViewById("interestRateSlider");
    this.loanTentureSlider = args.object.getViewById("loanTentureSlider");

    photoViewer = new photoViewerModule.PhotoViewer();

    this.viewWidth = appSettings.getNumber("viewWidth");
    this.seedMessages();
    setTimeout(()=>{
      this.bottomFloatingButtons.setToShown();
    },0)
    this.getCalendarEventsForMonth(new Date().getMonth(), new Date().getFullYear());

    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);
    this.on(observableModule.Observable.propertyChangeEvent, (data)=>{
      this.onPropertyChange(data);
    })
    this.onPropertyChange({});
  },
  onTick(args){
    
  },
  onUnloaded(args){
    this.off(ticker.tickEvent, this.onTick, this);
    this.off(observableModule.Observable.propertyChangeEvent, (data)=>{
      this.onPropertyChange(data);
    })
  },
  onTapCloseButton(args){
    frameModule.getFrameById("rootFrame").goBack();
  },
  onTapHomeButton(args){
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/main/page",
      animated: true,
      transition: {
        name: "slideRight",
      },
      clearHistory: true,
    });
  },
  onTapShareButton(args){
    
  },
  onTapChatButton(args){
    this.bottomCardDrawer.setToOpen();
    this.selectedDrawerTab = 0;
    console.log("Opening chat");
  },
  onTapCarModificationComponent(args){
    this.selectedCarModification = args.object.xcomponent;

    // Set tapped part to opaque
    args.object.animate({
      opacity: 1,
      duration: this.carModificationAnimationTime
    })

    // Dim the base model
    this.carModificationBase.animate({
      opacity: 0.5,
      duration: this.carModificationAnimationTime
    });

    // Set the other parts to transparent if not tapped
    if(args.object != this.carModificationWheels){
      this.carModificationWheels.animate({
        opacity: 0.011,
        duration: this.carModificationAnimationTime
      });
    }
    if(args.object != this.carModificationBody){
      this.carModificationBody.animate({
        opacity: 0.011,
        duration: this.carModificationAnimationTime
      });
    }
    if(args.object != this.carModificationDoors){
      this.carModificationDoors.animate({
        opacity: 0.011,
        duration: this.carModificationAnimationTime
      });
    }
    if(args.object != this.carModificationWindows){
      this.carModificationWindows.animate({
        opacity: 0.011,
        duration: this.carModificationAnimationTime
      });
    }
    if(args.object != this.carModificationBacklights){
      this.carModificationBacklights.animate({
        opacity: 0.011,
        duration: this.carModificationAnimationTime
      });
    }
  },
  onTapSellerInfo(args){
    // Navigate to seller profile
    appSettings.setBoolean("goToProfile", true);
    appSettings.setString("profileUsername",this.carPosting.post_by);
    frameModule.getFrameById("rootFrame").goBack();
  },
  onTapDrawerChatButton(args){
    this.selectedDrawerTab = 0;
  },
  onTapDrawerCalendarButton(args){
    this.selectedDrawerTab = 1;
  },
  onTouchDrawerContent(args){
    // Handler to lock the drawer's movement if user is touching the contents (i.e. Calendar/Chat)
    if(args.action == "up"){ // When user finger releases
      appSettings.setBoolean("drawerPanLock", false); // unlock the drawer panning
    } else {
      appSettings.setBoolean("drawerPanLock", true); // lock the drawer panning
    }
  },
  onCalendarDateSelected(args){
    console.log("onDateSelected");
    if(!this.ignoreCalendarDateChange){
      console.log("previous date "+this.selectedCalendarDate.getDate()+" "+(this.selectedCalendarDate.getMonth()+1)+" "+this.selectedCalendarDate.getYear());
      console.log("new date "+args.date.getDate()+" "+(args.date.getMonth()+1)+" "+args.date.getYear());
      if(args.date.getYear() < this.selectedCalendarDate.getYear()){
        this.drawerCalendar.navigateBack();
      }
      else if(args.date.getYear() > this.selectedCalendarDate.getYear()){
        this.drawerCalendar.navigateForward();
      }
      else if(args.date.getMonth() > this.selectedCalendarDate.getMonth()){
        this.drawerCalendar.navigateForward();
      }
      else if(args.date.getMonth() < this.selectedCalendarDate.getMonth()){
        this.drawerCalendar.navigateBack();
      }
      this.selectedCalendarDate = args.date;
      this.selectedCalendarDateNumberDisplay = args.date.getDate();
    }
  },
  onCalendarChangeMonth(args){
    console.log("onNavigatedToDate");
    console.log("previous date "+this.selectedCalendarDate.getDate()+" "+(this.selectedCalendarDate.getMonth()+1)+" "+this.selectedCalendarDate.getYear());
    console.log("new date "+args.date.getDate()+" "+(args.date.getMonth()+1)+" "+args.date.getYear());
    this.closeKeyboard();
    if(args.date.getMonth() != this.selectedCalendarDate.getMonth()){
      this.ignoreCalendarDateChange = true;
      var newDate = args.date;
      newDate.setDate(this.selectedCalendarDate.getDate());
      this.drawerCalendar.selectedDate = newDate;
      this.selectedCalendarDate = newDate;
      this.selectedCalendarDateNumberDisplay = newDate.getDate();
      setTimeout(()=>{
        this.ignoreCalendarDateChange = false;
      },10)
      console.log("changing")
    }
    this.getCalendarEventsForMonth(args.date.getMonth(), args.date.getFullYear());
  },
  onViewModeChanged(args){
    console.log("onViewModeChanged");
  },
  onTapCalendarTimeInput(args){
    this.closeKeyboard();
    let vm = this;
    picker.pickTime().then(result => {
        console.log("Selected time is: " + result.hour + ":" + result.minute);
        vm.selectedCalendarHour = result.hour;
        vm.selectedCalendarMinute = result.minute;
        vm.calendarTimeLabel = moment().hour(result.hour).minute(result.minute).format("h:mm a");
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  },
  onTapCalendarConfirmButton(args){
    var date = this.selectedCalendarDate;
    date.setHours(this.selectedCalendarHour);
    date.setMinutes(this.selectedCalendarMinute);
    var options = { 
      calendar:{
        name: 'SquareApp Calendar',
        color: '#FF415F',
      },
      title: 'Car Viewing',
      startDate: date,
      endDate: new Date(date.getTime() + 60*60*1000), // Assume car viewing lasts for 1 hour
      location: this.calendarVenueInput,
      notes: this.calendarNotesInput
    }
    calendarModule.createEvent(options).then((createdId)=>{
      alert("Successfully created new calendar event with id: "+createdId);
      // Reset inputs & display labels
      this.calendarVenueInput = "";
      this.calendarAgendaInput = "";
      this.calendarNotesInput = "";
      this.calendarTimeLabel = "";
      this.selectedCalendarHour = 0;
      this.selectedCalendarMinute = 0;
      this.getCalendarEventsForMonth(this.selectedCalendarDate.getMonth(), this.selectedCalendarDate.getFullYear());
    },
    (error)=>{
      alert("An error has occured: "+error);
    })
  },
  onTapCarImage(args) { 
    // brings up the photo viewer for the user to zoom into photos
    var photoIndex = args.object.xindex;
    var photoviewerOptions = {
        startIndex: photoIndex,
        ios: {
            titleFontSize: 20,
            creditFontSize: 14,
            fontFamily: "Avenir-Roman",
            titleColor: new colorModule.Color("#fff").ios,
            summaryColor: new colorModule.Color("#99813c").ios,
            creditColor: new colorModule.Color("#fed700").ios,
            completionCallback: this.galleryLoaded
        }
    };

    var testImage1 = {
        image: imageSourceModule.fromFile("~/images/graphics/image_placeholder_caratmbs.jpg").ios,
        title: "",
        summary: "",
        credit: ""
    };
    var testImage2 = {
        image: imageSourceModule.fromFile("~/images/graphics/image_placeholder_carwithgate.png").ios,
        title: "",
        summary: "",
        credit: ""
    };
    var testImage3 = {
        image: imageSourceModule.fromFile("~/images/graphics/image_placeholder_bmwfront.jpg").ios,
        title: "",
        summary: "",
        credit: ""
    };

    var myImages = [testImage1, testImage2, testImage3];

    photoViewer.showGallery(myImages, photoviewerOptions).then(function () {
        console.log("Gallery closed");
    });
  },
  onLongPressContactDetails(args){
    if(args.ios.state == 1){
      clipboard.setText(args.object.text).then(function(){
        alert("Copied to clipboard.");
      });
    }
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

  async getCarPostingAsync(){
    // Get information of the car listing
    var response = await server.getCarPosting({
      id: appSettings.getNumber("postIdToView")
    });
    this.carPosting = response["post"][0];
    this.sellingPrice = this.carPosting.price;
    this.calculateMaxLoanTenture();
    this.calculateCarDepreciationValue();
    this.buildTimestampString();
    this.buildRegistrationDateString();
    this.seedMarketComparisonData();

    // Get information of the seller
    var response = await server.getUserInfo({
      username:this.carPosting.post_by
    });
    this.sellerInfo = response["user"][0];
  }
});
