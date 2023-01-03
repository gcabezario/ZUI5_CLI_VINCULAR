sap.ui.define([
  'sap/ui/base/Object', 'sap/ui/model/json/JSONModel'
], (Object, JSONModel) => {
  return Object.extend('com.cx.clientes.vincular.controller.class.Base', {
    constructor: function() {
      this.model = new JSONModel();
      this.model.setData(this);
    },
    /**
     * Get JSONModel of the class
     * @public
     * @return {sap.ui.model.json.JSONModel} Model
     */
    getModel: function() {
      return this.model;
    },
    /**
     * Refresh JSON model
     * @public
     */
    refresh: function() {
      this.model.refresh();
    }
  });
});
