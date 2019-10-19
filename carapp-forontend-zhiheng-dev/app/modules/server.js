/* NOTE:
  Wrapper class for sending requests to the application server.
*/

//========== App Modules ==========//
var datastore = require("~/modules/datastore");

//========== Framework Modules ==========//
var httpModule = require("http");


//========== Config ==========//
var serverAddress = "https://www.squarecarapptest.tk";                          //root address of resource server
var requestTimeout = 5000;                                                      //request timeout in milliseconds

module.exports = {

  // #1 Account Registration
  async register({username, email, password, passwordConfirmation, firstName, lastName, profileImg}){
    console.log("register");
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/register`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['username']: username,
          ['email']: email,
          ['password']: password,
          ['password_confirmation']: passwordConfirmation,
          ['first-name']: firstName,
          ['last-name']: lastName,
          ['profile-img']: profileImg,
        }),
      });
      return response.content.toJSON();
    } catch(error){
      alert("The server is unreachable at the moment. Please check your internet connection.");
      console.log(error);
    }
  },

  // #2 User login
  async login({email, password}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/login`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['email']: email,
          ['password']: password,
        }),
      });
      var json = await response.content.toJSON();
      if(!json.error){//If login is successful
        console.log(json['api_token']);
        datastore.apiToken = json['token'];
      }
      return json;
    } catch(error){
      alert("The server is unreachable at the moment. Please check your internet connection.");
      console.log(error);
    }
  },

  // #5 Get user details (self)
  async getSelfUserInfo(){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/user-info?api_token=`+datastore.apiToken,
        method: "GET",
        timeout: requestTimeout,
      });
      console.log("json");
      console.log(`${serverAddress}/api/user-info?api_token=`+datastore.apiToken);
      console.log(response.content)
      var json = await response.content.toJSON();
      return json;
    } catch(error){
      console.log("http error");
      console.log(error);
    }
  },

  // #5 Get user details (others)
  async getUserInfo({username}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/user-info?username=`+username,
        method: "GET",
        timeout: requestTimeout,
      });
      var json = await response.content.toJSON();
      return json;
    } catch(error){
      console.log(error);
    }
  },

  // #11 Get details of a specific car posting
  async getCarPosting({id}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/get-specific-car-post?id=`+id,
        method: "GET",
        timeout: requestTimeout,
      });
      var json = await response.content.toJSON();
      return json;
    } catch(error){
      console.log(error);
    }
  },

  // #12 Search car postings
  async carFilter({types, makes, seats, doors, transmission, budgetMin, budgetMax, sortBy}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/car-filter`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['types']: types,
          ['makes']: makes,
          ['seats']: seats,
          ['doors']: doors,
          ['transmission']: transmission,
          ['budgetMin']: budgetMin,
          ['budgetMax']: budgetMax,
          ['sortBy']: sortBy,
        }),
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },

  //---------Functions below requires Login---------

  // #6 Post new listing
  async carPost({name, price, registrationDate, mileage, seats, doors, description, owners, manufactured, omv, arf, deregistrationValue, bhp, engineCapacity, roadTax, type, make, transmission, plateNumber, coe, coeExpiryDate, fuel, soldBy, mobileNumber, email, postImg, accessoriesImg, accessoriesDescriptions, accessoriesCategory}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/car-post`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['api_token']: datastore.apiToken,
          ['name']: name,
          ['price']: price,
          ['registration_date']: registrationDate,
          ['mileage']: mileage,
          ['seats']: seats,
          ['doors']: doors,
          ['description']: description,
          ['owners']: owners,
          ['manufactured']: manufactured,
          ['omv']: omv,
          ['arf']: arf,
          ['deregistration_val']: deregistrationValue,
          ['bhp']: bhp,
          ['engine_capacity']: engineCapacity,
          ['road_tax']: roadTax,
          ['type']: type,
          ['make']: make,
          ['transmission']: transmission,
          ['plate_number']: plateNumber,
          ['coe']: coe,
          ['coe_expiry_date']: coeExpiryDate,
          ['fuel']: fuel,
          ['sold_by']: soldBy,
          ['mobile_number']: mobileNumber,
          ['email']: email,
          ['postImg']: postImg,
          ['accessoriesImg']: accessoriesImg,
          ['accessoriesDescriptions']: accessoriesDescriptions,
          ['accessoriesCategory']: accessoriesCategory
        }),
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },

  // #10 Get all listings posted by user
  async getSelfListings(){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/get-user-car-post?api_token=`+datastore.apiToken,
        method: "GET",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },

  // #13 Get user favourites
  async getSelfFavourites(){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/favourite-list?api_token=`+datastore.apiToken,
        method: "GET",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },

  // #14 Add listing to favourites
  async addListingToFavourites({post_id}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/add-favourite`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['api_token']: datastore.apiToken,
          ['post_id']: post_id,
        }),
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },

  // #15 Remove listing from favourites
  async removeListingFromFavourites({post_id}){
    try{
      var response = await httpModule.request({
        url: `${serverAddress}/api/remove-favourite`,
        method: "POST",
        timeout: requestTimeout,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        content: JSON.stringify({
          ['api_token']: datastore.apiToken,
          ['post_id']: post_id,
        }),
      });
      return response.content.toJSON();
    } catch(error){
      console.log(error);
    }
  },
}
