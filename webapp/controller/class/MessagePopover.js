sap.ui.define(
  [
    'com/cx/clientes/vincular/controller/class/Base',
    'sap/m/MessagePopover',
    'sap/m/MessagePopoverItem',
    'sap/ui/model/json/JSONModel'
  ],
  (BaseClass, MessagePopover, MessagePopoverItem, JSONModel) => {
    const oMessageTemplate = new MessagePopoverItem({
      type: '{type}',
      title: '{title}',
      description: '{description}',
      subtitle: '{subtitle}',
      counter: '{counter}'
    });

    return BaseClass.extend('com.cx.clientes.vincular.controller.class.MessagePopover', {
      constructor: function(data) {
        BaseClass.call(this);
        
        if (data) {
          this.oView = data.view;
        }
        // Initialize popover messages button
        this.length = '0';
        this.type = 'Default';
        // Initialize component
        this.oMessagePopover = new MessagePopover({
          items: {
            path: '/',
            template: oMessageTemplate
          }
        });
        this.oMessagePopoverModel = new JSONModel();
        this.oMessagePopover.setModel(this.oMessagePopoverModel);
      },
      /**
       * Open or close message popover
       * @public
       * @param {sap.ui.base.Event} [oEvent] Object event
       */
      onPress: function(oEvent) {
        //oMessagePopover.openBy(oEvent.getSource());
        this.oMessagePopover.toggle(oEvent.getSource());
      },
      /**
       * Set messages to popover
       * @public
       * @param {array} [aErrorMessages] Array of messages
       * @param {boolean} [bIsReviewPage] Indicates whether it shows error messages on the summary page
       */
      update: function(aErrorMessages, bIsReviewPage) {
        this.oMessagePopoverModel.setData(aErrorMessages);
        this.oMessagePopoverModel.refresh();
        this.length = aErrorMessages.length;
        this.type = aErrorMessages.length === 0 ? 'Default' : 'Emphasized';
        this.model.refresh();

        // Open or close message popover if have errors
        if (aErrorMessages.length > 0) {
          this.oMessagePopover.openBy(this.oView.byId(bIsReviewPage ? 'reviewmessagepopup' : 'messagepopup'));
        } else {
          this.oMessagePopover.close();
        }
      }
    });
  }
);
