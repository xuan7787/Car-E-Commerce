var fileSystemModule = require("file-system");

/* NOTE:
  This script loads all js files from the same directory,
  and export it with the same name as the name of the file
  without the .js extension.
*/

function loadAllScriptsInDirectory(){
  var currFolder = fileSystemModule.Folder.fromPath(__dirname);
  var entities = currFolder.getEntitiesSync();

  for(var i = 0; i < entities.length; i++){
    var fileName = entities[i]._name;
    var extension = entities[i]._extension;

    if(fileName == "index.js") continue;
    if(extension != ".js") continue;

    var name = fileName.replace('.js','');
    module.exports[name] = require('./' + name)[name];
  }
}

loadAllScriptsInDirectory();
