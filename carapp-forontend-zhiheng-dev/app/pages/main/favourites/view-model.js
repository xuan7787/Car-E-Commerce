//========== App Modules ==========//
var enums = require("~/modules/enums");
var ticker = require("~/modules/ticker");
var datastore = require("~/modules/datastore");
var server = require("~/modules/server");

//========== View Model References ==========//
// var mainPageViewModel = require("../view-model.js");
// console.log(mainPageViewModel);

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
    if(listSize <= 3) listSize = 3;
    this.searchResultsListView.height = Math.ceil(listSize/2)*this.cardHeight + 96;
    if(listSize%2==0){
      this.searchResultsListView.height+=60;
    }
  },

  //========== Handlers ==========//
  onLoaded(args){
    this.viewWidth = appSettings.getNumber('viewWidth');
    this.cardWidth = this.viewWidth/2 - 8;
    this.cardHeight = this.cardWidth + 130;

    this.userFavourites = datastore.userFavourites;
    this.getFavouritesAsync();

    this.searchResultsScrollView = args.object.getViewById("searchResultsScrollView");
    this.searchResultsListView = args.object.getViewById("searchResultsListView");

    this.searchResultsScrollView.on('scroll', this.onScrollSearchResultsScrollView, this);
    this.searchResultsListView.on('pan', this.onScrollSearchResultsScrollView, this);

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
  onTapCloseButton(args){
    frameModule.getFrameById("rootFrame").goBack();
  },
  onScrollSearchResultsScrollView(args){
    this.latestScroll = new Date();
  },
  async getFavouritesAsync(){
    var response = await server.getSelfFavourites();
    var observableArray = new observableArrayModule.ObservableArray(response["posts"]);
    this.assignIndexToObservableArrayElements(observableArray);
    this.searchResultData = observableArray;
    this.updateListViewHeight(observableArray.length);
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
  }
});
