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
				 this.oDataModel = data.controller.getOwnerComponent().getModel();
        		 this.oDataModel.setRefreshAfterChange(false);
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
		 /**
    * Post request
    * @public
    * @param {object} [oParams] Parameters to send
    * @return {object} Response results
    */
    post(oParams) {
      let that = this;
      oParams.url += '?format=json';
        	//sobreescribimos el metodo para que no muestre la excepcion 
          	//ya que la vamos a tratar nosotros
          	that.oDataModel.fireRequestFailed =  function(mArguments) {
				return this;
			};
      var promise = new Promise(function (resolve, reject) {
        that.oDataModel.create(oParams.url, oParams.data, {
          success: function(oResponse) {
            // console.log('SERVICE POST', oResponse);
            if (oResponse !== undefined) {
              try {
              /*  that.checkErrors(oResponse);
                that.parseRetornosMessages(oResponse);*/
                resolve(oResponse);
              } catch (oError) {
                reject(oError);
              }
            } else {
              let oError = new Error();
              oError.aMessages = that.getDefaultErrorMessages();
              reject(oError);
            }
          },
          error: function(error) {
          	
            //console.error('POST Error', error);
            //let oErrorr = new Error();
            //oErrorr.aMessages = that.getDefaultErrorMessages();
            let oErrorr = that.parseOdataException(error);
            reject(oErrorr);
          }
        });
      });
      return promise;
    },
    	/**
		 * Get error messages of the exception into array
		 * @return {array} Array of parsed messages
		 */
		parseOdataException: function (error) {
			if (error && error.responseText) {
				var parsedError = JSON.parse(error.responseText);
				return [{
					type: 'Error',
					counter: 0,
					//title: parsedError.error.message.value
					title: parsedError.error.innererror.errordetails[0].message
				}];
			}
			return that.getDefaultErrorMessages();

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
		  /**
     * GPI2022-675 Comisión de gestión Portugal
     * Get static info of opening commission 
     * @public
     * @return {object} Response results
     */
    getUserData() {
     return this.callFunction('/getUserData', {});
    },
    
    /**
     * GPI2019-2824	Comisión de Apertura Portugal
     * oData read function import
     * @public
     * @param {string} [sRemoteFunction] Name of function import
     * @param {object} [oData] Data to send in json format
     * @param {string} [sMethod] CRUD method
     * @return {object} Response results
     */
    callFunction(sRemoteFunction, oData, sMethod) {
      let that = this;
      var promise = new Promise(function (resolve, reject) {
        sMethod = sMethod || 'GET';
        
        that.oDataModel.callFunction(
          sRemoteFunction, {
            method: sMethod,
           /* urlParameters: {
              Input: JSON.stringify(oData)
            },*/
            success: function(oResponse) {
              if (oResponse !== undefined) {
                /*that.checkErrors(oResponse);
                that.parseRetornosMessages(oResponse);*/
                resolve(oResponse);
              } else {
                let oError = new Error();
                oError.aMessages = that.getDefaultErrorMessages();
                reject(oError);
              }
            },
            error: function(error) {
              console.error('READ Error', error);
              let oError = new Error();
              oError.aMessages = that.getDefaultErrorMessages();
              reject(oError);
            }
          }
        );
      });
      return promise;
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