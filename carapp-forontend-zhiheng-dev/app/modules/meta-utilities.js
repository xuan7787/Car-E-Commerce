/* NOTE:
  Metaprogramming functions used in the application.
*/

module.exports = {
  nicifyVariableName(string){//Converts camel case to normal case, and remove all underscores
    string = string.replace( /_/g, "");
    string = string.replace( /([A-Z])/g, " $1" );
    string = string.charAt(0).toUpperCase() + string.slice(1);

    return string;
  },
  getEnumKeyNames(enumObject){//Return an array of key names of an enum
    var keyNames = [];
    for(var key in enumObject){
      var index = enumObject[key];
      keyNames[index] = key;
    }
    return keyNames;
  },
  camelToSnakeCase(string){
    return string.replace( /([A-Z])/g, "_$1" ).toLowerCase();
  },
};
