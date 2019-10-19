//========== App Modules ==========//
var SearchSetting = require("~/modules/search-setting");

var enums = require("~/modules/enums");
var datastore = require("~/modules/datastore");
var metaUtilities = require("~/modules/meta-utilities");
var server = require("~/modules/server");

//========== View Model References ==========//
var searchResultPageViewModel = require("../searchresult/view-model");


//========== Framework Modules ==========//
var platform = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var appSettings = require("application-settings");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  datastore: datastore,

  unselectedTagColor: "gray",
  selectedTagColor: "#3386FF",
  selectedBorderColor: "gray",
  selectedBackgroundColor: "#eaeaea",

  sortBySettingNames: [], //<string[]>
  sortBySettingLabelStrings: [], //<string[]>
  carTypeSettingNames: [], //<string[]>
  carMakeSettingNames: [], //<string[]>

  savedSearchSettings: [], //<SearchSetting[]>
  recentSearchSettings: [], //<SearchSetting[]>
  trendingSearchSettings: [], //<SearchSetting[]>

  savedSearchSettingsHighlightedIndex: -1,
  recentSearchSettingsHighlightedIndex: -1,
  trendingSearchSettingsHighlightedIndex: -1,
  sortBySettingIndex: 0,
  carTypeSelectionMap: [],  //<bool[]>
  carMakeSelectionMap: [],  //<bool[]>
  seatsInput: 0,
  doorsInput: 0,
  isTransmissionManual: false,
  budgetMinInput: "",
  budgetMaxInput: "",

  // For layout purposes
  viewWidth: 0,

  showMoreMake: false,

  mainPageViewModel: {},
  setMainPageViewModel(vm) {
    this.mainPageViewModel = vm;
    searchResultPageViewModel.setMainPageViewModel(vm);
    
   },
  //========== Functions ==========//
  getSearchSettingDisplayString(searchSetting){
    //Returns the name string to display for a search setting

    if(!searchSetting) return "";
    if(searchSetting.query) return searchSetting.query;

    var sortBySettingIndex = searchSetting.sortBySetting;
    if(!sortBySettingIndex) sortBySettingIndex = 0;

    return this.sortBySettingLabelStrings[sortBySettingIndex];
  },
  getCurrentSearchSetting(){
    var query = this.mainPageViewModel.navBarSearchFieldText;
    var sortBySetting = this.sortBySettingIndex;

    return new SearchSetting({
      query: query,
      sortBySetting: sortBySetting,
      // TODO: Retrieve remaining properties
    });
  },
  setCurrentSearchSetting(searchSetting){
    this.mainPageViewModel.navBarSearchFieldText = searchSetting.query;
    this.sortBySettingIndex = searchSetting.sortBySetting;

    this.updateSearchSettingsHighlightedIndexes();
  },
  updateSearchSettingsHighlightedIndexes(){
    //Determines which search setting label should be displayed as blue

    var currentSearchSetting = this.getCurrentSearchSetting();

    //Saved Search Settings
    var savedMatchingIndex = -1;
    for(var i = 0; i < datastore.savedSearchSettings.length; i++){
      if(SearchSetting.compare(datastore.savedSearchSettings[i], currentSearchSetting)){//If search setting is same as current search setting
        savedMatchingIndex = i;
        break;
      }
    }

    this.savedSearchSettingsHighlightedIndex = savedMatchingIndex;

    //Recent Search Settings
    var recentMatchingIndex = -1;
    for(var i = 0; i < datastore.recentSearchSettings.length; i++){
      if(SearchSetting.compare(datastore.recentSearchSettings[i], currentSearchSetting)){//If search setting is same as current search setting
        recentMatchingIndex = i;
        break;
      }
    }
    this.recentSearchSettingsHighlightedIndex = recentMatchingIndex;

    //Trending Search Settings
    var trendingMatchingIndex = -1;
    for(var i = 0; i < datastore.trendingSearchSettings.length; i++){
      if(SearchSetting.compare(datastore.trendingSearchSettings[i], currentSearchSetting)){//If search setting is same as current search setting
        trendingMatchingIndex = i;
        break;
      }
    }
    this.trendingSearchSettingsHighlightedIndex = trendingMatchingIndex;
  },

  //========== Handlers ==========//
  onLoaded(args){
    require("../view-model").onEnterSearchSettings();

    this.viewWidth = appSettings.getNumber("viewWidth")

    //Make an array of the label strings to display for the sortby settings, from what's defined in sortBySettingEnum
    this.sortBySettingNames = metaUtilities.getEnumKeyNames(enums.sortBySettingEnum);
    var sortBySettingLabelStrings = [];
    for(var i = 0; i < this.sortBySettingNames.length; i++){
      sortBySettingLabelStrings[i] = metaUtilities.nicifyVariableName(this.sortBySettingNames[i]);
    }
    this.sortBySettingLabelStrings = sortBySettingLabelStrings;

    //Make an array of car type setting names from carTypeSettingEnum
    this.carTypeSettingNames = metaUtilities.getEnumKeyNames(enums.carTypeSettingEnum);

    //Make an array of car make setting names from carMakeSettingEnum

    //// TEMP:
    datastore.savedSearchSettings = [
      new SearchSetting({
        query: "",
        sortBySetting: 0,
      }),
      new SearchSetting({
        query: "Toyota Corell",
        sortBySetting: 1,
      }),
    ];
    datastore.recentSearchSettings = [
      new SearchSetting({
        query: "",
        sortBySetting: 0,
      }),
      new SearchSetting({
        query: "BMW Coupe",
        sortBySetting: 1,
      }),
      new SearchSetting({
        query: "Toyota Corell",
        sortBySetting: 1,
      }),
      new SearchSetting({
        query: "Nissan Nuee",
        sortBySetting: 1,
      }),
    ];
    datastore.trendingSearchSettings = [
      new SearchSetting({
        query: "BMW Coupe",
        sortBySetting: 1,
      }),
    ];

    this.savedSearchSettings = [...datastore.savedSearchSettings];
    this.recentSearchSettings = [...datastore.recentSearchSettings];
    this.trendingSearchSettings = [...datastore.trendingSearchSettings];


  },
  onTapSavedSearchSetting(args){
    var index = args.object.index;

    //Assign currentSearchSetting to a clone of the tapped search setting
    this.setCurrentSearchSetting(new SearchSetting(datastore.savedSearchSettings[index]));

  },
  onTapRecentSearchSetting(args){
    var index = args.object.index;

    //Assign currentSearchSetting to a clone of the tapped search setting
    this.setCurrentSearchSetting(new SearchSetting(datastore.recentSearchSettings[index]));

  },
  onTapTrendingSearchSetting(args){
    var index = args.object.index;

    //Assign currentSearchSetting to a clone of the tapped search setting
    this.setCurrentSearchSetting(new SearchSetting(datastore.trendingSearchSettings[index]));

  },
  onTapSortBySetting(args){
    var index = args.object.index;
    this.sortBySettingIndex = index;

    this.updateSearchSettingsHighlightedIndexes();
  },
  onTapCarType(args){
    var index = args.object.index;

    var carTypeSelectionMap = [...this.carTypeSelectionMap];  //Clone array
    carTypeSelectionMap[index] ^= 1;
    this.carTypeSelectionMap = carTypeSelectionMap;

    this.updateSearchSettingsHighlightedIndexes();
  },
  onTapCarMake(args){
    var index = args.object.index;

    var carMakeSelectionMap = [...this.carMakeSelectionMap];  //Clone array
    carMakeSelectionMap[index] ^= 1;
    this.carMakeSelectionMap = carMakeSelectionMap;

    this.updateSearchSettingsHighlightedIndexes();
  },
  onTapShowMoreMake(args){
    this.showMoreMake = !this.showMoreMake;
  },

  //Transmission buttons (automatic/manual)
  onTapTransmissionManual(args){
    this.isTransmissionManual = true;
  },
  onTapTransmissionAutomatic(args){
    this.isTransmissionManual = false;
  },

  //Seats and Doors button increment
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

  onTapDeleteSavedSearchSetting(args){
    var index = this.savedSearchSettingsHighlightedIndex;

    if(index != -1){
      datastore.savedSearchSettings.splice(index, 1);
      this.savedSearchSettingsHighlightedIndex = -1;
      this.savedSearchSettings = [...datastore.savedSearchSettings];
    }
  },

  onTapDeleteRecentSearchSetting(args){
    var index = this.recentSearchSettingsHighlightedIndex;

    if(index != -1){
      datastore.recentSearchSettings.splice(index, 1);
      this.recentSearchSettingsHighlightedIndex = -1;
      this.recentSearchSettings = [...datastore.recentSearchSettings];
    }
  },
  onTapSearchSettingsResetButton(args){
    this.savedSearchSettingsHighlightedIndex= -1;
    this.recentSearchSettingsHighlightedIndex= -1;
    this.trendingSearchSettingsHighlightedIndex= -1;
    this.sortBySettingIndex= 0;
    this.carTypeSelectionMap= [];
    this.carMakeSelectionMap= [];
    this.seatsInput= 0;
    this.doorsInput= 0;
    this.isTransmissionManual= false;
    this.budgetMinInput= "";
    this.budgetMaxInput= "";
    this.mainPageViewModel.navBarSearchFieldText = "";
  },

  onMainPageTapApplySearchButton(args){
    datastore.searchResultsStore = [];
    this.onGetCarFilterResultsAsync();
  },

  async onGetCarFilterResultsAsync(){
    try{
      var types = [];
      for(var i = 0; i < this.carTypeSelectionMap; i++){
        if(this.carTypeSelectionMap[i]){
          types.push(i+1);
        }
      }

      var makes = [];
      for(var i = 0; i < this.carMakeSelectionMap; i++){
        if(this.carMakeSelectionMap[i]){
          makes.push(i+1);
        }
      }

      var seats = this.seatsInput;
      var doors = this.doorsInput;
      var transmission = this.isTransmissionManual ? 2 : 1;
      var budgetMin = this.budgetMinInput;
      var budgetMax = this.budgetMaxInput;
      var sortBy = metaUtilities.camelToSnakeCase(this.sortBySettingNames[this.sortBySettingIndex]);

      var response = await server.carFilter({
        types: types,
        makes: makes,
        seats: seats,
        doors: doors,
        transmission: transmission,
        budgetMin: budgetMin,
        budgetMax: budgetMax,
        sortBy: sortBy,
      });
      datastore.searchResultsStore = response.data;
      searchResultPageViewModel.displayData(response.data);
    } catch(error){
      console.log(error);
    }
  },
});
