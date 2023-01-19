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
					i18n: this.i18n,
					controller: this
				});
				this.oRootScopeModel = this.getOwnerComponent().getModel('rootScope');
				this.oRootScope = this.oRootScopeModel.getData();

				var sRootPath = jQuery.sap.getModulePath("com.cx.clientes.vincular");
				var sImagePath = sRootPath + "/img/under-construction1.png";
				var oDataImage = {
					ImagePath: sImagePath
				};
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
			onloadCallback() {

			},
			onAfterRendering() {

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
				let oUserData = await this.service.getUserData();
				this.GuidUser = oUserData.Guid;
				oUserData.GuidUser = oUserData.Guid;
				oUserData.Guid = "";
				oUserData.Stcd1User = oUserData.Stcd1;
				oUserData.Stcd1 = "";
				oUserData.CustomerName = "";
				oUserData.Tipodocu = "";

				this.userModel = new JSONModel(oUserData);
				this.getView().setModel(this.userModel, 'user');

				let oResults = await this.service.getCombos();
				this.oScopeModel = new JSONModel(oResults);

				this.getView().setModel(this.oScopeModel, 'scope');

				BusyIndicator.hide();
			},

			async onBeforeRebindTable(oSource){
				var tabla = oSource.getSource();
			    var binding = oSource.getParameter("bindingParams");
				
				
				if(!this.GuidUser){
					let oUserData = await this.service.getUserData();
					this.GuidUser = oUserData.Guid;
					tabla.rebindTable()
				} else{
					var oFilter = new sap.ui.model.Filter("GuidUser", sap.ui.model.FilterOperator.EQ, this.GuidUser);
			    	binding.filters.push(oFilter);		
				}
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

			validateCaptcha() {

				if (grecaptcha.getResponse().length == 0) {
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
				if (validator.validate()) { // && this.validateCaptcha()) {

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
				var oData = {
					Mail: data.Mail,
					GuidUser: data.GuidUser,
					Stcd1User: data.Stcd1User,
					Tipodocu: data.Tipodocu,
					Stcd1: data.Stcd1,
					CustomerName: data.CustomerName,
					Telf1: data.Telf1
				}
				switch (data.Tipodocu) {
				case "CIF":
					oData.Tipodocu = "L";
					break;
				case "NIF":
					oData.Tipodocu = "D";
					break;
				case "NIE":
					oData.Tipodocu = "R";
					break;
				default:
				}

				return oData;
			},

			onClienDataExit() {
				var oDialog = this.oView.byId('dataToSendId');
				if (oDialog) oDialog.destroy();
			},

			onOpenDialogClientData() {
				var oDialog = sap.ui.xmlfragment(
					this.oView.getId(),
					'com.cx.clientes.vincular.view.fragments.ClienData',
					this);
				//	oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				this.oView.addDependent(oDialog);

				oDialog.open();
			},

			/**
			 * Event fired when press Financial validation request button 
			 */
			async onPressNewClient() {
				this.onClienDataExit();

				let oBusyDialog = this.getBusyDialog(true, undefined, this.i18n.getText('Confirm.VincularClienteWaiting'));
				oBusyDialog.open();
				try {
					//this.messagePopover.update([]);
					let oData = this.getDataToSend();
					let oParams = {
						url: '/UsuariosVinculadosSet',
						data: oData
					};

					let oResults = await this.service.post(oParams);

					// console.log('onPressFinancialValidationRequest:', oResults);
					/*	this.offer.setData(oResults);
						this.offer.refresh();*/
					oBusyDialog.close();
					oBusyDialog.destroy();
					this.postRequestSuccessHandler(oResults);

				} catch (error) {
					//this.messagePopover.update(error.aMessages);

					oBusyDialog.close();
					oBusyDialog.destroy();

					this.messagePopover.update(error);
				}
			},
			
			postRequestSuccessHandler(oResults) {
				
					
				MessageBox.information(this.i18n.getText('Message.successSend', oResults.Solicitud), {
					
					styleClass: this.getOwnerComponent().getContentDensityClass()
					
				});
				this.oView.byId('tableUsuariosVinculados').rebindTable();

			},
			
			getBusyDialog(isNew, sTitle, sText, cbCloseButton) {
				if (this.oBusyDialog === undefined || isNew) {
					if (this.oBusyDialog !== undefined) {
						this.oBusyDialog.destroy();
					}
					this.oBusyDialog = new sap.m.BusyDialog('busyDialogId', {
						title: sTitle,
						text: sText,
						showCancelButton: cbCloseButton !== undefined,
						close: function (oEvent) {
							if (cbCloseButton !== undefined) {
								cbCloseButton(oEvent);
							}
						}
					});
				}
				return this.oBusyDialog;
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