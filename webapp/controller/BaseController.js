/* @flow */

sap.ui.define([
  'sap/ui/core/mvc/Controller',
  'sap/ui/core/routing/History',
  'sap/ui/model/json/JSONModel',
  'com/cx/clientes/vincular/model/formatter',
  'com/cx/clientes/vincular/controller/class/MessagePopover'
], function(Controller, History, JSONModel, formatter, MessagePopoverClass) {

  return Controller.extend('com.cx.clientes.vincular.controller.BaseController', {

    /**
     * Map with functions to all formatters.
     * @public
     * @type {map}
     */
    formatter: formatter,

    /**
     * Go one step back in broser history.
     * @public
     */
    onNavBack() {
    	
     // window.history.go(-1);
      	let urlParams = new URLSearchParams(window.location.search);
      	var sUrl = '/wplogin';
      	
      	//Si hay url de retorno la aplicamos
      	if (urlParams.has('sap-return-url')) {
      			sUrl = urlParams.get('sap-return-url');
      	}
      	
      	if (urlParams.has('sap-language')) {
      			sUrl += '?sap-language=' + urlParams.get('sap-language');
      	}
       //window.location = sUrl;
       	window.parent.location.href = sUrl;
       	
    },

    /**
     * Get router of UI Component.
     * @public
     * @returns {sap.m.routing.Router} App Router.
     */
    getRouter() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    },
    /**
     * Start Base controller
     * @public
     */
    initMessagePopover() {
      this.messagePopover = new MessagePopoverClass({view: this.getView()});
      this.getOwnerComponent().setModel(this.messagePopover.getModel(), 'buttonMessages');
    },
    /**
     * Open or close message popover
     * @public
     * @param {sap.ui.base.Event} [oEvent] Object event
     */
    handleMessagePopoverPress: function(oEvent) {
      this.messagePopover.onPress(oEvent);
    }
  });
});
