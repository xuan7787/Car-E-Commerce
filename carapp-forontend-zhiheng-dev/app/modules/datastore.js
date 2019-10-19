/* NOTE:
  This script exports the datastore object, for storing application-wide data.
*/

var observableModule = require("tns-core-modules/data/observable");
var observableArrayModule = require("tns-core-modules/data/observable-array");

module.exports.datastore = observableModule.fromObject({
  apiToken: "",

  userInfo: {},
  userFavourites:[],

  savedSearchSettings: [], //<SearchSetting[]>
  recentSearchSettings: [], //<SearchSetting[]>
  trendingSearchSettings: [], //<SearchSetting[]>

  searchResultsStore: [],
});
