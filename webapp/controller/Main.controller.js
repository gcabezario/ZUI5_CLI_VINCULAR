sap.ui.define(
	[
		'com/cx/clientes/vincular/controller/BaseController',
		'com/cx/clientes/vincular/node_modules/openui5-validator/dist/resources/openui5/validator/Validator',
		'com/cx/clientes/vincular/model/schemas',
		'com/cx/clientes/vincular/controller/class/Service',
		'sap/m/MessageBox',
		'sap/ui/core/BusyIndicator',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageToast'
	],
	function (BaseController, Validator, Schemas, ServiceClass, MessageBox, BusyIndicator, JSONModel, MessageToast) {

		return BaseController.extend('com.cx.clientes.vincular.controller.Main', {
			/**
			 * Called when the controller is instantiated.
			 * @public
			 */
			onInit() {
				this.i18n = this.getOwnerComponent().getModel('i18n').getResourceBundle();

				this.service = new ServiceClass({
					i18n: this.i18n
				});
				this.oRootScopeModel = this.getOwnerComponent().getModel('rootScope');
				this.oRootScope = this.oRootScopeModel.getData();
				
				var sRootPath = jQuery.sap.getModulePath("com.cx.clientes.vincular");
				var sImagePath = sRootPath + "/img/under-construction1.png";
				var oDataImage={
					ImagePath :sImagePath
				} ;
				this.oDataImageModel = new sap.ui.model.json.JSONModel(oDataImage);
				this.oView.setModel(this.oDataImageModel, 'ImageModel');

				this.oScope = {
					statics: {}
				};
				this.oScopeModel = new sap.ui.model.json.JSONModel(this.oScope);

				this.oScopeModel.setSizeLimit(1000);
				this.oView.setModel(this.oScopeModel, 'scope');

				this.oRouter = this.getOwnerComponent().getRouter();
				this.oRouter.getRoute('root').attachMatched(this.onRouteMatched, this);

				this.initMessagePopover();

			},

			/**
			 * Called when registeres route was matched.
			 */
			onRouteMatched() {
    
				this.initModel();
			},
			onloadCallback(){
				
			},
			onAfterRendering(){
				
				/*jQuery.sap.includeScript(
			        "https://www.google.com/recaptcha/api.js" 
			    );*/
			},
						
		

			initData() {
				this.data = {
					usuario: {
						tipo: "",
						numero: "",
						nombre: "",
						personaContacto: "",
						//apellido2: "",
						email: "",
						telefono: ""
					},
					cliente: {
						tipo: "",
						numero: "",
						nombre: "",
						personaContacto: "",
						//apellido2: "",
						email: "",
						telefono: ""
					},
				};
			},
			initDataTest() {
				this.data = {
					usuario: {
						tipo: "NIF",
						numero: "55555555K",
						nombre: "Prueba",
						personaContacto: "Garcia",
						//apellido2: "Rodriguez",
						email: "aaaaaa@ddd.com",
						telefono: "985742569"
					},
					cliente: {
						tipo: "",
						numero: "",
						nombre: "",
						personaContacto: "",
						//apellido2: "",
						email: "",
						telefono: ""
					},
				};
			},
			async initModel() {
				BusyIndicator.show(0);

				//this.initDataTest();
				this.initData();
				this.userModel = new JSONModel(this.data);
				this.getView().setModel(this.userModel, 'user');

				let oResults = await this.service.getCombos();
				this.oScopeModel = new JSONModel(oResults);
				
			
				this.getView().setModel(this.oScopeModel, 'scope');

				BusyIndicator.hide();
			},

			copyDataFromUser() {

				this.data.cliente.tipo = this.data.usuario.tipo;
				this.data.cliente.numero = this.data.usuario.numero;
				this.data.cliente.nombre = this.data.usuario.nombre;
				this.data.cliente.personaContacto = this.data.usuario.personaContacto;
				//this.data.cliente.apellido2 = this.data.usuario.apellido2;
				this.data.cliente.email = this.data.usuario.email;
				this.data.cliente.telefono = this.data.usuario.telefono;
				this.userModel.refresh();
			},
			clearModel() {
				//this.data.cliente.tipo = "";
				this.data.cliente.numero = "";
				this.data.cliente.nombre = "";
				this.data.cliente.personaContacto = "";
				this.data.cliente.email = "";
				this.data.cliente.telefono = "";
				//this.data.usuario.tipo = "";
				this.data.usuario.numero = "";
				this.data.usuario.nombre = "";
				this.data.usuario.personaContacto = "";
				this.data.usuario.email = "";
				this.data.usuario.telefono = "";
				this.userModel.refresh();
				//grecaptcha.reset();
			},
			/**
			 * Event fired when clic
			 * @param {sap.ui.base.Event} [oEvent] An Event object consisting of an id, a source and a map of parameters.
			 */
			
			validateCaptcha(){
			
				if( grecaptcha.getResponse().length == 0){
					MessageToast.show(this.i18n.getText('Message.confirmNotRobot'));
			          
			       this.oView.byId('recaptchaGoogle').addStyleClass("myStateErrorCaptcha");
			           
					return false;
				}
				
				this.oView.byId('recaptchaGoogle').removeStyleClass("myStateErrorCaptcha");
				 return true;
			},
			 
			onPressAccept(oEvent) {
				let oSchemaParams = {
					step: 'validationForm',
					aOptions: []
				};
				let validator = new Validator(this.oView, Schemas.getStep(oSchemaParams), null, 'es');
				if (validator.validate()) {// && this.validateCaptcha()) {

					MessageBox.confirm(
						this.i18n.getText('Message.confirmSend'), {
							styleClass: this.getOwnerComponent().getContentDensityClass(),
							initialFocus: MessageBox.Action.OK,
							onClose: function (oAction) {
								if (oAction === MessageBox.Action.OK) {
									this.sendDataAfiliacion();
								}
							}.bind(this)
						}
					);

				}
			},
			async sendDataAfiliacion() {
				BusyIndicator.show(500);
				try {
					this.messagePopover.update([]);
					let oData = this.getDataToSend();
					let oResults = await this.service.sendDataAfilicion(oData);

					this.postRequestSuccessHandler(oResults);

				} catch (error) {
					this.messagePopover.update(error.aMessages);
				}
				BusyIndicator.hide();
			},
		
			/**
			 * Post request finished with success status
			 * @param {object} [oResults] Response object
			 */
			postRequestSuccessHandler(oResults) {
				if (oResults.type == 'E') {
					this.updateMessagePopover(oResults.errores);
				}
				if (oResults.type == 'S') {
					MessageBox.information(this.i18n.getText('Message.successSend', oResults.solicitud), {
						actions: [this.i18n.getText('Message.moreUser'), this.i18n.getText('Message.exit')],
						styleClass: this.getOwnerComponent().getContentDensityClass(),
						initialFocus: this.i18n.getText('Message.exit'),
						onClose: function (oAction) {
							if (oAction === this.i18n.getText('Message.moreUser')) {
								this.clearModel();
							} else if (oAction === this.i18n.getText('Message.exit')) {
								this.onNavBack();
							}
						}.bind(this)
					});
				}

			},

			updateMessagePopover(aErrores) {

				var aMessages = [];
				for (var i = 0; i < aErrores.length; i++) {
					var message = {
						type: 'Error',
						counter: i,
						title: aErrores[i].descripcion
					};
					aMessages.push(message);
				}
				this.messagePopover.update(aMessages);
			},

			/**
			 * Get info  to send
			 * @public
			 * @return {object} Data to send
			 */
			getDataToSend() {
				var data = this.getView().getModel('user').getData();

				return data;
			},
		
			/**
			 * Event fired when check state of inputs
			 * @public
			 * @param {sap.ui.base.Event} [oEvent] Event object
			 */
			handleValidationSuccess(oEvent) {
				let oField = oEvent.getSource();
				let sId = oField.getId().split('--')[1];
				let schemaValidator = Schemas.getSchemaById(sId, oField.data('view'));
				let validator = new Validator(this.oView, schemaValidator, null, 'es');
				validator.validate();
			}
		});
	}
);