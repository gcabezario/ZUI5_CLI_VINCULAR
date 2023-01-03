'use strict';

sap.ui.define([
	'sap/ui/base/Object',
	'com/cx/clientes/vincular/controller/class/Ajax',
	'sap/ui/model/json/JSONModel'
], (Object, Ajax, JSONModel) => {
	return Object.extend('com.cx.clientes.vincular.controller.class.Service', {
		constructor: function (data) {
			if (data) {
				this.i18n = data.i18n;
			}
			this.ajax = new Ajax();
		},
			/**
		 * Get generic error messages into array
		 * @return {array} Array of parsed messages
		 */
		getDefaultErrorMessages: function () {
			return [{
				type: 'Error',
				counter: 0,
				title: this.i18n.getText('Error.systemError')
			}];
		},
		
		async getCombos(oData) {
			let oResults;
			try {
				oResults = await this.ajax.send({
					sURL: '/sap/bc/weblogin/wp2.6',
					sType: 'GET'
				});
			} catch (error) {
				let oError = new Error();
				oError.aMessages = this.getDefaultErrorMessages();
				throw oError;
			}
			this.checkErrors(oResults);
			return oResults;
		},
		
		async sendDataAfilicion(oData) {
			let oResults;
			try {
				oResults = await this.ajax.send({
					sURL: '/sap/bc/weblogin/wp4.1',
					oParameters: oData,
					sType: 'POST'
				});
			} catch (error) {
				let oError = new Error();
				oError.aMessages = this.getDefaultErrorMessages();
				throw oError;
			}
			this.checkErrors(oResults);
			return oResults;
		},
		/**
		 * Check if response have errors and Parsing error messages into array
		 * @param {object} [oResults] Object response from server
		 */
		checkErrors: function checkErrors(oResults) {
			if (oResults.ERRORES && oResults.ERRORES.length > 0) {
				var oError = new Error();
				oError.aMessages = this.parseErrorMessages(oResults.ERRORES);
				throw oError;
			}
		},
		
		send: function send(oParams) {
			if (!oParams.sType) {
				oParams.sType = 'GET';
			}

			return $.ajax({
				url: oParams.sURL + '?format=json',
				type: oParams.sType,
				async: true,
				dataType: 'json',
				contentType: 'application/json',
				cache: oParams.bCache,
				data: JSON.stringify(oParams.oParameters),
				success: function success(results) {
					oParams.fnCallback(null, results);
				},
				error: function error(xhr, status, _error) {
					console.log('An error occured: ' + xhr.status + ' ' + xhr.statusText, status);
					oParams.fnCallback(true);
				}
			});
		}

	});
});