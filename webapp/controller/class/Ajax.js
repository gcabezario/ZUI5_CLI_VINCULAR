sap.ui.define([
  'sap/ui/base/Object', 'sap/ui/model/json/JSONModel'
], (Object, JSONModel) => {
  return Object.extend('com.cx.clientes.vincular.controller.class.Ajax', {
    constructor: function() {
    },
    /**
     * Make HTTP request
     * @public
     * @param {object} [oParams] Parameters to config request and data to send
     * @return {Promise} Return promise of HTTP request
     */
    send: async function(oParams) {
      if (!oParams.sType) {
        oParams.sType = 'GET';
      }

      const result = $.ajax({
        url: oParams.sURL + '?format=json',
        type: oParams.sType,
        async: true,
        dataType: 'json',
        contentType: 'application/json',
        cache: oParams.bCache,
        data: JSON.stringify(oParams.oParameters),
      });
      return result;
    },
    get: async function(oParams) {
      if (!oParams.sType) {
        oParams.sType = 'GET';
      }

      const result = $.ajax({
        url: oParams.sURL,
        type: oParams.sType,
        async: true,
        dataType: 'json',
        contentType: 'application/json',
        //data: JSON.stringify(oParams.oParameters),
        data: oParams.oParameters,
      });
      return result;
    }
    
  });
});
