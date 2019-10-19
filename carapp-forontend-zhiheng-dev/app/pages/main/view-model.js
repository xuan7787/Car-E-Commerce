//========== App Modules ==========//
var enums = require("~/modules/enums");
var datastore = require("~/modules/datastore");
var server = require("~/modules/server")

//========= View Model References ==========//
var searchSettingsPageViewModel = require("./searchsettings/view-model");

//========== Framework Modules ==========//
var application = require("tns-core-modules/application");
var platformModule = require("platform");
var appSettings = require("application-settings");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var dialogs = require("tns-core-modules/ui/dialogs");
var camera = require("nativescript-camera");

var ModalPicker = require("nativescript-modal-datetimepicker").ModalDatetimepicker;
var picker = new ModalPicker();

module.exports = observableModule.fromObject({
  //Global Settings
  viewWidth: 0,

  //========== Properties ==========//
  navBarSearchFieldText: "", //<string>
  queryStringCache: "", //<string>

  //Navbar
  showMessagesButton: true,
  showProfileButton: true,
  showFavouritesButton: false,
  showCancelSearchButton: false,
  expandSearchField: false,

  //Floating Buttons
  bottomFloatingButtons: {},
  applySearchButton: {},
  listAndSellButton: {},
  showHomeButton: false,
  showListCarButton: true,
  
  //List Car Drawer
  unselectedTagColor: "gray",
  selectedTagColor: "#3386FF",
  selectedBorderColor: "gray",
  selectedBackgroundColor: "#eaeaea",

  listCarCardDrawerHeight: platformModule.screen.mainScreen.heightDIPs,

  // listCarCarImage: "~/images/testimage2.jpg",
  listCarCarImage: "",
  modelNameInput: "",
  priceInput: "",
  coeInput: "",
  depreciationInput: "",
  selectedFuelId: 1,
  selectedTypeId: 0,
  selectedMakeId: 0,
  showMoreMake: false,
  registrationYear: new Date().getFullYear(),
  registrationMonth: new Date().getMonth()+1,
  registrationDay: new Date().getDate(),
  coeExpiryYear: new Date().getFullYear(),
  coeExpiryMonth: new Date().getMonth()+1,
  coeExpiryDay: new Date().getDate(),
  mileageInput: "",
  emailInput: "",
  phoneNumberInput: "",
  isTransmissionManual: false,
  ownersInput: 1,
  seatsInput: 4,
  doorsInput: 4,
  descriptionInput: "",
  plateNumberInput: "",
  manufacturedInput: 2010,
  omvInput: "",
  arfInput: "",
  deregistrationValueInput: 5020,
  bhpInput: 5030,
  engineCapacityInput: "",
  roadTaxInput: 9001,

  selectedCarModification: "",
  carModificationDoors: {},
  carModificationWheels: {},
  carModificationWindows: {},
  carModificationBacklights: {},
  carModificationBody: {},
  carModificationBase: {},
  carModificationAnimationTime: 150, // in milliseconds

  //Page Slides
  mainPageCurrentSlide: -1, //<mainPageSlideEnum>

  //References
  hiddenTextField: {}, //<TextField>

  listingCardDrawer: {},

  // Deprecated variables
  showBottomFloatingButtons: true,
  showApplySearchButton: false,
  showListAndSellButton: false,

  //========== Functions ==========//
  unfocusSearchBar() {
    this.hiddenTextField.focus();
    this.hiddenTextField.dismissSoftInput();
  },
  getDateString(year, month, date) {
    if (!month) month = 1;
    if (!date) date = 1;
    if (month.length == 1) month = "0" + month;
    if (date.length == 1) date = "0" + date;
    return `${year}-${month}-${date}`;
  },
  resetListingCardDrawer(){
    this.modelNameInput = "";
    this.priceInput = "";
    this.depreciationInput = "";
    this.selectedFuelId = 1;
    this.selectedTypeId = 0;
    this.selectedMakeId = 0;
    this.showMoreMake = false;
    this.registrationMonth = new Date().getMonth()+1;
    this.registrationYear = new Date().getFullYear();
    this.registrationDay = new Date().getDate();
    this.coeInput = "";
    this.coeExpiryYear = new Date().getFullYear();
    this.coeExpiryMonth = new Date().getMonth()+1;
    this.coeExpiryDay = new Date().getDate();
    this.mileageInput = "";
    this.emailInput = "";
    this.phoneNumberInput = "";
    this.isTransmissionManual = false;
    this.ownersInput = 1;
    this.seatsInput = 4;
    this.doorsInput = 4;
    this.descriptionInput = "";
    this.plateNumberInput = "";
    this.omvInput = "";
    this.arfInput = "";
    this.engineCapacityInput = "";
  },
  //========== Handlers ==========//
  onLoaded(args) {
    var page = args.object;
    this.hiddenTextField = page.getViewById("hiddenTextField");
    this.listingCardDrawer = page.getViewById("listCarCardDrawer");
    this.bottomFloatingButtons = page.getViewById("bottomFloatingButtons");
    this.applySearchButton = page.getViewById("applySearchButton");
    this.listAndSellButton = page.getViewById("listAndSellButton");

    this.carModificationBase = page.getViewById("carModificationBase");
    this.carModificationWheels = page.getViewById("carModificationWheels");
    this.carModificationBody = page.getViewById("carModificationBody");
    this.carModificationDoors = page.getViewById("carModificationDoors");
    this.carModificationWindows = page.getViewById("carModificationWindows");
    this.carModificationBacklights = page.getViewById("carModificationBacklights");

    var todayDate = new Date();
    var box = page.getViewById('registrationDateBox0');
    box.text = Math.floor(todayDate.getDate()/10).toString();
    var box = page.getViewById('registrationDateBox1');
    box.text = Math.floor(todayDate.getDate()%10).toString();
    var box = page.getViewById('registrationDateBox2');
    box.text = Math.floor((todayDate.getMonth()+1)/10).toString();
    var box = page.getViewById('registrationDateBox3');
    box.text = Math.floor((todayDate.getMonth()+1)%10).toString();
    var box = page.getViewById('registrationDateBox4');
    box.text = Math.floor(todayDate.getYear()/10%10).toString();
    var box = page.getViewById('registrationDateBox5');
    box.text = Math.floor(todayDate.getYear()%10).toString();

    var todayDate = new Date();
    var box = page.getViewById('coeExpiryDateBox0');
    box.text = Math.floor(todayDate.getDate()/10).toString();
    var box = page.getViewById('coeExpiryDateBox1');
    box.text = Math.floor(todayDate.getDate()%10).toString();
    var box = page.getViewById('coeExpiryDateBox2');
    box.text = Math.floor((todayDate.getMonth()+1)/10).toString();
    var box = page.getViewById('coeExpiryDateBox3');
    box.text = Math.floor((todayDate.getMonth()+1)%10).toString();
    var box = page.getViewById('coeExpiryDateBox4');
    box.text = Math.floor(todayDate.getYear()/10%10).toString();
    var box = page.getViewById('coeExpiryDateBox5');
    box.text = Math.floor(todayDate.getYear()%10).toString();

    // viewWidth refers to the maximum width that each element can take up
    // (so there will be 20 units of blank space at each side)
    appSettings.setNumber("viewWidth", platformModule.screen.mainScreen.widthDIPs - 40);
    this.viewWidth = appSettings.getNumber("viewWidth");
    this.emailInput = datastore.userInfo.email;
    this.phoneNumberInput = datastore.userInfo.mobile_number;
    //Set up back button event handler
    if (application.android) {
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
    /*
    switch (this.mainPageCurrentSlide) {
      case enums.mainPageSlideEnum.dashboard:
        this.onEnterDashboard();
        break;
      case enums.mainPageSlideEnum.searchSettings:
        this.onEnterSearchSettings();
        break;
      case enums.mainPageSlideEnum.searchResult:
        this.onEnterSearchResult();
        break;
      default:
    }
    */

    // Navigate to profile page if goToProfile setting is set to true
    if(appSettings.getBoolean("goToProfile")){
      appSettings.setBoolean("goToProfile", false);
      frameModule.getFrameById("mainFrame").navigate({
        moduleName: "pages/main/profile/page",
        animated: true,
        transition: {
          name: "slideLeft",
        },
      });
    }

    searchSettingsPageViewModel.setMainPageViewModel(this);
  },
  onUnloaded(args) {
    if (application.android) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.onBackButtonPressed, this);
    }
  },

  //Navbar
  onTapNavBarMessagesButton(args) {//Handler for tapping the messages button
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/conversations/page",
      animated: true,
      transition: {
        name: "slideLeft"
      }
    });
  },
  onTapNavBarProfileButton(args) {
    if(this.mainPageCurrentSlide != enums.mainPageSlideEnum.profile){
      appSettings.setBoolean("selfProfile",true);
      frameModule.getFrameById("mainFrame").navigate({
        moduleName: "pages/main/profile/page",
        animated: true,
        transition: {
          name: "slideLeft",
        },
      });
    }
  },
  onTapNavBarSearchField(args) {//Handler for tapping the search text field
    switch (this.mainPageCurrentSlide) {
      case enums.mainPageSlideEnum.searchResult:
        frameModule.getFrameById("mainFrame").navigate({
          moduleName: "pages/main/searchsettings/page",
          animated: true,
          transition: {
            name: "slideRight",
          },
        });
        break;
      case enums.mainPageSlideEnum.searchSettings:
        break;
      default:
        frameModule.getFrameById("mainFrame").navigate({
          moduleName: "pages/main/searchsettings/page",
          animated: true,
          transition: {
            name: "fade",
          },
        });
        break;
    }
  },
  onTapNavBarCancelSearchButton(args) {
    if (this.mainPageCurrentSlide != enums.mainPageSlideEnum.searchSettings) return;//Do nothing if current page is not search settings page
    //Navigate to dashboard
    frameModule.getFrameById("mainFrame").goBack();
  },
  onTapNavBarFavouritesButton(args) {
    if (this.mainPageCurrentSlide == enums.mainPageSlideEnum.favourites) return;
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/main/favourites/page",
      animated: true,
      transition: {
        name: "fade"
      },
    });
  },

  //Dashboard buttons (called from dashboard view-model)
  onTapDashboardToolsButton(args){
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/main/dashboard/tools/page",
      animated: true,
      transition:{
        name: "fade"
      },
    });
  },

  //Floating Buttons
  onTapApplySearchButton(args) {
    if (this.mainPageCurrentSlide != enums.mainPageSlideEnum.searchSettings) return;//Do nothing if current page is not search settings page
    searchSettingsPageViewModel.onMainPageTapApplySearchButton(args);
    //Navigate to search results
    frameModule.getFrameById("mainFrame").navigate({
      moduleName: "pages/main/searchresult/page",
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
    this.showHomeButton = true;
  },
  onTapBottomListCarButton(args) {//Handler for tapping the bottom floating listcar button
    let vm = this;
    this.listAndSellButton.setToShown();
    this.listingCardDrawer.setToOpen();
    this.bottomFloatingButtons.setToHidden();
    setTimeout(()=>{
      vm.showListCarButton = false;
    }, 500);

    // Case handler for search settings (to elevate the Apply Search button)
    if(this.mainPageCurrentSlide == enums.mainPageSlideEnum.searchSettings){
      this.applySearchButton.setToElevatedShown();
    }
  },
  onTapListAndSellButton(args) {
    this.onListCarAsync();
  },

  //List Car Drawer
  onTapCloseDrawerButton(args) {
    this.listAndSellButton.setToHidden();
    this.showListCarButton = true;
    this.listingCardDrawer.setToClose();
    this.resetListingCardDrawer();
    // Don't restore new listing button if in searchSettings
    if(this.mainPageCurrentSlide != enums.mainPageSlideEnum.searchSettings){
      this.bottomFloatingButtons.setToShown();
      this.showListCarButton = true;
    } else {
      this.applySearchButton.setToShown();
    }
  },
  onTapCarImage(args) {
    // Depreciated function for now
    // this.onTakeCarPhotoAsync();
  },
  onTapAddCarImage(args){
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/camera/page",
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
  },
  onTapFuelType(args){
    this.selectedFuelId = args.object.index;
    console.log(this.selectedFuelId);
  },
  onTapCarType(args) {
    this.selectedTypeId = args.object.index;
  },
  onTapCarMake(args) {
    this.selectedMakeId = args.object.index;
  },
  onTapShowMoreMake(args) {
    this.showMoreMake = !this.showMoreMake;
  },
  onTapHomeButton(args){
    //Navigate to dashboard
    frameModule.getFrameById("mainFrame").navigate({
      moduleName: "pages/main/dashboard/page",
      animated: true,
      transition: {
        name: "slideRight",
      },
      clearHistory: true
    });
  },
  onListCarCardDrawerClosed(args) {
    this.listAndSellButton.setToHidden();
  },

  selectCOEExpiryDateOverlay(args) {
    this.unfocusSearchBar();
    var startingDate = new Date();
    console.log("helpplz");
    console.log(startingDate);
    console.log(this.coeExpiryDay);
    console.log(this.coeExpiryMonth);
    console.log(this.coeExpiryYear);
    if(this.coeExpiryDay) {
      // Set starting date to previously picked date if exists
      startingDate.setYear(this.coeExpiryYear);
      startingDate.setMonth(this.coeExpiryMonth-1);
      startingDate.setDate(this.coeExpiryDay);
    }
    console.log(startingDate);
    picker.pickDate({
      title: "Select Registration Date",
      theme: "overlay",
      startingDate: startingDate,
      minDate: new Date()
    }).then((result) => {
      if (result) {
        this.coeExpiryDay = result.day;
        this.coeExpiryMonth = result.month;
        this.coeExpiryYear = result.year;
        // TODO Lots of repeating code, but I can't find a better way to do this
        // Updates each coeExpiryDisplayBox
        var view = args.object;
        var box = view.getViewById('coeExpiryDateBox0');
        box.text = Math.floor(result.day/10).toString();
        var box = view.getViewById('coeExpiryDateBox1');
        box.text = Math.floor(result.day%10).toString();
        var box = view.getViewById('coeExpiryDateBox2');
        box.text = Math.floor(result.month/10).toString();
        var box = view.getViewById('coeExpiryDateBox3');
        box.text = Math.floor(result.month%10).toString();
        var box = view.getViewById('coeExpiryDateBox4');
        box.text = Math.floor(result.year/10%10).toString();
        var box = view.getViewById('coeExpiryDateBox5');
        box.text = Math.floor(result.year%10).toString();
      } else {
        this.coeExpiryDay = false;
        this.coeExpiryMonth = false;
        this.coeExpiryYear = false;
      }
    }).catch((error) => {
        console.log("Error: " + error);
    });
  },
  
  selectRegistrationDateOverlay(args) {
    this.unfocusSearchBar();
    var startingDate = new Date();
    if(this.registrationDay) {
      // Set starting date to previously picked date if exists
      startingDate.setYear(this.registrationYear);
      startingDate.setMonth(this.registrationMonth-1);
      startingDate.setDate(this.registrationDay);
    }
    picker.pickDate({
      title: "Select Registration Date",
      theme: "overlay",
      startingDate: startingDate,
      maxDate: new Date(),
      minDate: new Date('1970-01-01')
    }).then((result) => {
      if (result) {
        this.registrationDay = result.day;
        this.registrationMonth = result.month;
        this.registrationYear = result.year;
        // TODO Lots of repeating code, but I can't find a better way to do this
        // Updates each registrationDateDisplayBox
        var view = args.object;
        var box = view.getViewById('registrationDateBox0');
        box.text = Math.floor(result.day/10).toString();
        var box = view.getViewById('registrationDateBox1');
        box.text = Math.floor(result.day%10).toString();
        var box = view.getViewById('registrationDateBox2');
        box.text = Math.floor(result.month/10).toString();
        var box = view.getViewById('registrationDateBox3');
        box.text = Math.floor(result.month%10).toString();
        var box = view.getViewById('registrationDateBox4');
        box.text = Math.floor(result.year/10%10).toString();
        var box = view.getViewById('registrationDateBox5');
        box.text = Math.floor(result.year%10).toString();
      } else {
        this.registrationDay = false;
        this.registrationMonth = false;
        this.registrationYear = false;
      }
    }).catch((error) => {
        console.log("Error: " + error);
    });
  },

  mileageInputOverlay(args) {
    let vm = this;
      dialogs.prompt({
        title: "Mileage",
        message: "Enter the mileage of your car",
        okButtonText: "OK",
        cancelButtonText: "Cancel",
        defaultText: "",
        inputType: dialogs.inputType.decimal
      }).then(function (r){
        // input validation
        if(isNaN(r.text)) {
          vm.mileageInput = 0;
        } else if(r.text > 999999) {
          vm.mileageInput = 999999
        } else if(r.text < 0) {
          vm.mileageInput = 0;
        } else {
          vm.mileageInput = r.text;
        }
        // TODO Lots of repeating code, but I can't find a better way to do this
        // Updates each mileageDisplayBox
        var view = args.object;
        var box = view.getViewById('mileageBox0');
        box.text = Math.floor(vm.mileageInput/100000).toString();
        var box = view.getViewById('mileageBox1');
        box.text = Math.floor(vm.mileageInput/10000%10).toString();
        var box = view.getViewById('mileageBox2');
        box.text = Math.floor(vm.mileageInput/1000%10).toString();
        var box = view.getViewById('mileageBox3');
        box.text = Math.floor(vm.mileageInput/100%10).toString();
        var box = view.getViewById('mileageBox4');
        box.text = Math.floor(vm.mileageInput/10%10).toString();
        var box = view.getViewById('mileageBox5');
        box.text = Math.floor(vm.mileageInput%10).toString();
      });
    //}
  },

  //Transmission buttons (automatic/manual)
  onTapTransmissionManual(args){
    this.isTransmissionManual = true;
  },
  onTapTransmissionAutomatic(args){
    this.isTransmissionManual = false;
  },

  // Owners, seats and doors button increment
  onTapIncreaseOwnersCount(args){
    this.ownersInput += 1;
    if(this.ownersInput > 9) this.ownersInput = 9;
  },
  onTapDecreaseOwnersCount(args){
    this.ownersInput -= 1;
    if(this.ownersInput < 1) this.ownersInput = 1;
  },
  onTapIncreaseSeatCount(args){
    this.seatsInput += 1;
  },
  onTapDecreaseSeatCount(args){
    this.seatsInput -= 1;
    if(this.seatsInput < 1) this.seatsInput = 1;
  },
  onTapIncreaseDoorCount(args){
    this.doorsInput += 1;
    if(this.doorInput > 9) this.doorInput = 9;
  },
  onTapDecreaseDoorCount(args){
    this.doorsInput -= 1;
    if(this.doorsInput < 1) this.doorsInput = 1;
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

  //Page Slides
  onEnterDashboard() {
    this.mainPageCurrentSlide = enums.mainPageSlideEnum.dashboard;

    this.showMessagesButton = true;
    this.showProfileButton = true;
    this.showFavouritesButton = false;
    this.showHomeButton = true;
    this.showCancelSearchButton = false;
    this.expandSearchField = false;
    this.bottomFloatingButtons.setToHidden();
    setTimeout(()=>{
      this.listingCardDrawer.State == 0
      ? this.bottomFloatingButtons.setToShown()
      : this.bottomFloatingButtons.setToHidden();
      this.showHomeButton = false;
    },510);
    this.applySearchButton.setToHidden();

    this.unfocusSearchBar();

    this.queryStringCache = this.navBarSearchFieldText;
    this.navBarSearchFieldText = "";
  },
  onEnterSearchSettings() {
    this.mainPageCurrentSlide = enums.mainPageSlideEnum.searchSettings;
    this.showMessagesButton = false;
    this.showProfileButton = false;
    this.showFavouritesButton = false;
    this.showCancelSearchButton = true;
    this.expandSearchField = true;
    this.bottomFloatingButtons.setToHidden();
    this.listingCardDrawer.State == 2
    ? this.applySearchButton.setToElevatedShown()
    : this.applySearchButton.setToShown();

    this.navBarSearchFieldText = this.queryStringCache;
  },
  onEnterSearchResult() {
    this.mainPageCurrentSlide = enums.mainPageSlideEnum.searchResult;

    this.showMessagesButton = true;
    this.showProfileButton = false;
    this.showFavouritesButton = true;
    this.showCancelSearchButton = false;
    this.expandSearchField = false;
    this.listingCardDrawer.State == 0
      ? this.bottomFloatingButtons.setToShown()
      : this.bottomFloatingButtons.setToHidden();
    this.applySearchButton.setToHidden();

    this.unfocusSearchBar();

    this.queryStringCache = this.navBarSearchFieldText;
    this.navBarSearchFieldText = "";
  },
  onEnterProfile(){
    this.showMessagesButton = true;
    this.showProfileButton = false;
    this.showFavouritesButton = true;
    this.showCancelSearchButton = false;
    this.expandSearchField = false;
    this.applySearchButton.setToHidden();
    this.unfocusSearchBar();
    this.mainPageCurrentSlide = enums.mainPageSlideEnum.profile;
    this.bottomFloatingButtons.setToHidden();
    let vm = this;
    setTimeout(()=>{
      vm.showHomeButton = true;
      vm.bottomFloatingButtons.setToShown();
    },510);
  },
  
  //Android
  onBackButtonPressed(args) {
    switch (this.mainPageCurrentSlide) {
      case enums.mainPageSlideEnum.dashboard:
        break;
      case enums.mainPageSlideEnum.searchSettings:
        //If back button is pressed on the search setings slide, cancel default back button behavior and go to the dashboard
        args.cancel = true;
        frameModule.getFrameById("mainFrame").navigate({
          moduleName: "pages/main/dashboard/page",
          animated: true,
          transition: {
            name: "fade",
          },
        });
        break;
      case enums.mainPageSlideEnum.searchResult:
        //If back button is pressed on the search setings slide, cancel default back button behavior and go to the search settings
        args.cancel = true;
        this.pageSlides.previousSlide();
        break;
      case enums.mainPageSlideEnum.profile:
        args.cancel = true;
        this.pageSlides.nextSlide();
      default:
    }
  },

  //Async
  async onListCarAsync() {
    try {
      var name = this.modelNameInput;
      var price = this.priceInput;
      var coe = this.coeInput;
      var registrationDate = this.getDateString(this.registrationYear, this.registrationMonth, this.registrationDay);
      var coeExpiryDate = this.getDateString(this.coeExpiryYear, this.coeExpiryMonth, this.coeExpiryDay);
      var mileage = this.mileageInput;
      var seats = this.seatsInput;
      var doors = this.doorsInput;
      var description = this.descriptionInput;
      var owners = this.ownersInput;
      var manufactured = this.getDateString(this.manufacturedInput);
      var omv = this.omvInput;
      var arf = this.arfInput;
      var deregistrationValue = this.deregistrationValueInput;
      var bhp = this.bhpInput;
      var engineCapacity = this.engineCapacityInput;
      var roadTax = this.roadTaxInput;
      var type = +this.selectedTypeId + 1;
      var make = +this.selectedMakeId + 1;
      var fuel = this.selectedFuelId;
      var soldBy = datastore.userInfo.username;
      var transmission = this.isTransmissionManual ? 2 : 1;
      var mobile_number = this.phoneNumberInput;
      var email = this.emailInput;
      var plateNumber = this.plateNumberInput;

      var response = await server.carPost({
        name: name,
        price: price,
        registrationDate: registrationDate,
        mileage: mileage,
        seats: seats,
        doors: doors,
        description: description,
        owners: owners,
        manufactured: manufactured,
        omv: omv,
        arf: arf,
        deregistrationValue: deregistrationValue,
        bhp: bhp,
        engineCapacity: engineCapacity,
        roadTax: roadTax,
        type: type,
        make: make,
        transmission: transmission,
        plateNumber: plateNumber,
        coe: coe,
        coeExpiryDate: coeExpiryDate  ,
        fuel: fuel,
        mobileNumber: mobile_number,
        email: email,
        soldBy: "2",
        accessoriesImg: null,
        accessoriesDescriptions: null,
        accessoriesCategory: null,
        postImg: null,
      });
      console.log(response);
      if (response.state) {
        dialogs.alert(response.state);
      } else {
        dialogs.alert("Please fill in every field correctly");
      }

    } catch (error) {
      console.log(error);
    }
  },
  async onTakeCarPhotoAsync() {
    var imageAsset = await camera.takePicture();
    this.listCarCarImage = imageAsset;
  },

});
