sap.ui.define([
  'sap/ui/core/UIComponent',
  'com/cx/clientes/vincular/model/models',
  'sap/m/MessageBox',
  'sap/ui/Device',
  'sap/ui/model/json/JSONModel'
], function(UIComponent, models, MessageBox, Device, JSONModel) {
  return UIComponent.extend('com.cx.clientes.vincular.Component', {
    metadata: {
      manifest: 'json'
    },

    /* ----------------------------------------------------------- *
    * lifecycle methods
    * ----------------------------------------------------------- */

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init() {
      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), 'device');
      // set the base model
      this.oRootScopeModel = new JSONModel();
      this.setModel(this.oRootScopeModel, 'rootScope');

      // create the views based on the url/hash
      this.getRouter().initialize();
      
      
        // Get loged user info
/*      var oModel = new JSONModel();
      oModel.loadData('/sap/bc/ui2/start_up');
      this.setModel(oModel, 'user');*/
    },

    /* ----------------------------------------------------------- *
    * publilc methods
    * ----------------------------------------------------------- */

    /**
     * This method can be called to determine whether the sapUiSizeCompact
     * or sapUiSizeCozy design mode class should be set,
     * which influences the size appearance of some controls.
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy'
     * @public
     */
    getContentDensityClass() {
      /*
         * Determine whether the sapUiSizeCompact or sapUiSizeCozy design mode class should be set for this app
         * - sapUiSizeCozy: needed to improve touch behaviour;
         * - sapUiSizeCompact: apply compact mode if touch is not supported;
         * IDEA: this could me made configurable for the user on 'combi' devices with touch AND mouse.
         */
      if (!this._sContentDensityClass) {
        this._sContentDensityClass = Device.support.touch ? 'sapUiSizeCozy' : 'sapUiSizeCompact';
      }
      return this._sContentDensityClass;
    }
  });
});
