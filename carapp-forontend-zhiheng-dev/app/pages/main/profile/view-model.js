//========== App Modules ==========//
var enums = require("~/modules/enums");
var ticker = require("~/modules/ticker");
var server = require("~/modules/server");
var datastore = require("~/modules/datastore");

//========== View Model References ==========//
// var mainPageViewModel = require("../view-model");

//========== Framework Modules ==========//
var platformModule = require("platform");
var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");
var timerModule = require("tns-core-modules/timer");
var frameModule = require("tns-core-modules/ui/frame");
var colorModule = require("tns-core-modules/color");
var appSettings = require("application-settings");

module.exports = observableModule.fromObject({
  //========== Properties ==========//
  searchResultData: new observableArrayModule.ObservableArray(),
  userFavourites: [],

  searchResultFavouriteButtonOpacity: 1,

  latestScroll: {}, //<Date>

  searchResultsScrollView: {}, //<ScrollView>
  searchResultsListView: {}, //<RadListView>

  // For layout purposes
  viewWidth: 0,
  cardWidth: 0,
  cardHeight: 0,
  userProfileHeight: 85,
  ListViewHeight: 0,

  // Whether the user is viewing his own profile
  selfProfile: false,

  // User data, for view binding
  userInfo: {},
  userFavourites:{},

  mainPageViewModel: {},

  setMainPageViewModel: (vm) => {
    this.mainPageViewModel = vm;
  },

  //========== Functions ==========//
  assignIndexToObservableArrayElements(observableArray){//Assigns the index of the array elements in the searchResultData ObservableArray to the array elements
    for(var i = 0; i < observableArray.length; i++){
      observableArray.getItem(i).index = i;
      observableArray.getItem(i).favourited = this.userFavourites.includes(observableArray.getItem(i).id)
    }
    return observableArray;
  },
  updateListingFavouriteButton(index){
    var tempListing = this.searchResultData.getItem(index)
    tempListing.favourited = this.userFavourites.includes(tempListing.id)
    this.searchResultData.setItem(index, tempListing);
  },
  updateListViewHeight(listSize){
    this.searchResultsListView.height = Math.ceil(listSize/2)*this.cardHeight + 96;
    if(listSize%2==0){
      this.searchResultsListView.height+=60;
    }
  },

  //========== Handlers ==========//
  onLoaded(args){
    require("../view-model").onEnterProfile();
    // Grab all the listings that the user have
    if(appSettings.getBoolean("selfProfile")){
      this.selfProfile = true;
      this.userInfo = datastore.userInfo;
      this.getUserListingsAsync(datastore .userInfo.username);
    } else {
      this.selfProfile = false;
      this.getUserInfoAsync(appSettings.getString("profileUsername"));
      this.getUserListingsAsync(appSettings.getString("profileUsername"));
    }

    this.userFavourites = datastore.userFavourites;

    this.searchResultsScrollView = args.object.getViewById("searchResultsScrollView");
    this.searchResultsListView = args.object.getViewById("searchResultsListView");

    this.searchResultsScrollView.on('scroll', this.onScrollSearchResultsScrollView, this);
    this.searchResultsListView.on('pan', this.onScrollSearchResultsScrollView, this);

    this.viewWidth = appSettings.getNumber('viewWidth');
    this.cardWidth = this.viewWidth/2 - 8;
    this.cardHeight = this.cardWidth + 130;

    //Set up tick event handler
    ticker.addToNotificationList(this);
    this.on(ticker.tickEvent, this.onTick, this);

  },
  onUnloaded(args){
    this.searchResultsScrollView.off('scroll', this.onScrollSearchResultsScrollView, this);
    this.searchResultsListView.off('pan', this.onScrollSearchResultsScrollView, this);

    ticker.removeFromNotificationList(this);
    this.off(ticker.tickEvent, this.onTick, this);
  },
  onTick(args){
    var timeSinceLatestScroll = new Date() - this.latestScroll;

    if(timeSinceLatestScroll < 500){
      if(this.searchResultFavouriteButtonOpacity == 0) return;

      var fadeDuration = 250;

      var tickInterval = args.deltaTime;
      var fadeRate = tickInterval / fadeDuration;


      this.searchResultFavouriteButtonOpacity = Math.max(0, this.searchResultFavouriteButtonOpacity - fadeRate);
    } else {
      if(this.searchResultFavouriteButtonOpacity == 1) return;

      var emergeDuration = 250;

      var tickInterval = args.deltaTime;
      var emergeRate = tickInterval / emergeDuration;

      this.searchResultFavouriteButtonOpacity = Math.min(1, this.searchResultFavouriteButtonOpacity + emergeRate);
    }
  },
  onTapCarEntry(args){
    appSettings.setNumber("postIdToView", this.searchResultData.getItem(args.index).id);
    frameModule.getFrameById("rootFrame").navigate({
      moduleName: "pages/carinfo/page",
      animated: true,
      transition: {
        name: "slideLeft",
      },
    });
  },
  onTapFavouriteListingButton(args){
    if(this.userFavourites.includes(args.object.xpostid)){ // Already favourited
      // Remove from favourites
      this.userFavourites = this.userFavourites.filter(item => item !== args.object.xpostid);
      this.removeListingFromFavouritesAsync(args.object.xpostid);
      alert("Successfully removed listing from favourites!");
    }
    else{ // Not in favourites
      // Add to favourites
      this.userFavourites.push(args.object.xpostid);
      this.addListingToFavouritesAsync(args.object.xpostid);
      alert("Successfully added listing to favourites!");
    }
    this.updateListingFavouriteButton(args.object.xindex);
    datastore.userFavourites = this.userFavourites;
    console.log(args.object.xpostid);
  },
  onScrollSearchResultsScrollView(args){
    this.latestScroll = new Date();
  },

  async getUserListingsAsync(){
    var response = await server.getSelfListings();
    var observableArray = new observableArrayModule.ObservableArray(response["posts"]);
    this.assignIndexToObservableArrayElements(observableArray);
    this.searchResultData = observableArray;
    // Update the height of the scrollview after getting all the user's listings
    this.updateListViewHeight(observableArray.length);
  },

  async getUserInfoAsync(username){
    var response = await server.getUserInfo({
      username: username
    });
    this.userInfo = response["user"][0];
  },

  async removeListingFromFavouritesAsync(post_id){
    var response = await server.removeListingFromFavourites({
      post_id: post_id
    });
  },

  async addListingToFavouritesAsync(post_id){
    var response = await server.addListingToFavourites({
      post_id: post_id
    });
  },
});
