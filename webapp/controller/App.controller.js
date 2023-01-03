sap.ui.define(['com/cx/clientes/vincular/controller/BaseController'], function(BaseController) {
  return BaseController.extend('com.cx.clientes.vincular.controller.App', {
    onInit: function() {
      // This is ONLY for being used within the tutorial.
      // The gidefault log level of the current running environment may be higher than INFO,
      // in order to see the debug info in the console, the log level needs to be explicitly
      // set to INFO here.
      // But for application development, the log level doesn't need to be set again in the code.
      //
      // jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
      //

      var oRouter = this.getRouter();

      oRouter.attachBypassed(function(oEvent) {
        var sHash = oEvent.getParameter('hash');
        // do something here, i.e. send logging data to the backend for analysis
        // telling what resource the user tried to access...
        jQuery.sap.log.info('Sorry, but the hash \'' + sHash + '\' is invalid.', 'The resource was not found.');
      });

      oRouter.attachRouteMatched(function(oEvent) {
        var sRouteName = oEvent.getParameter('name');
        // do something, i.e. send usage statistics to backend
        // in order to improve our app and the user experience (Build-Measure-Learn cycle)
        jQuery.sap.log.info('User accessed route ' + sRouteName + ', timestamp = ' + new Date().getTime());
      });

      // There we query the helper function that we defined on the app component to set the corresponding style class on the app view,
      // All controls inside the app view will now automatically adjust either to the compact or cozy size as defined by the style.
      this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
    }
  });
});
