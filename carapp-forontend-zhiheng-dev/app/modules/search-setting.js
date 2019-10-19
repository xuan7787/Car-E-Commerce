/* NOTE:
  A class that defines the data structure of the search settings.
*/

class SearchSetting{
  constructor(args = {}){
    var {
      query,
      sortBySetting,
      carTypeMap,
      carMakeMap,
      budgetMin,
      budgetMax,
      depreciationMin,
      depreciationMax,
      installmentMin,
      installmentMax,
      transmission,
      seats,
      doors
    } = args;

    this.query = query;
    this.sortBySetting = +sortBySetting;
  }
  getDisplayString(){
    //Returns the name string to display for the search setting
    if(this.query) return this.query;

    var sortBySettingIndex = this.sortBySetting;
    if(!sortBySettingIndex) sortBySettingIndex = 0;

    return this.sortBySettingLabelStrings[sortBySettingIndex];
  }
  static compare(searchSettingA, searchSettingB){//Returns true if two search settings have the same values
    return JSON.stringify(searchSettingA) === JSON.stringify(searchSettingB);
  }
}

module.exports = SearchSetting;
