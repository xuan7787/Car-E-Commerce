var viewModel = require("./view-model");

export function onPageLoaded(args){
  //The onLoaded method of the view model is called whenever the page is navigated to
  viewModel.onLoaded && viewModel.onLoaded(args);
  args.object.bindingContext = viewModel;
}
export function onPageUnloaded(args){
  //The onUnloaded method of the view model is called upon exiting the page
  viewModel.onUnloaded && viewModel.onUnloaded(args);
}
