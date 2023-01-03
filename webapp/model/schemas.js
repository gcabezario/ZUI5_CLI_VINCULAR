sap.ui.define([], function() {

  let emailSchema = {
    type: 'string',
    format: 'email',
    minLength: 0
  };
    let textSchema = {
    type: 'string',
    minLength: 3
  };
  
   let nifSchema = {
    type: 'string',
    maxLength: 10,
    minLength: 9
  };
  let telefonoSchema = {
    type: 'integer',
    minimum: 9,
    minLength: 9
  };
  let oSchemas = {
    validationForm: {
      properties: {
/*        customerDocumentId: nifSchema,
        customerNameId: textSchema,
        customerPersonaContactoId: textSchema,
        customerEmailId:emailSchema,
        customerMobileId:telefonoSchema,
        clientDocumentId: nifSchema,
        clientNameId: textSchema,
        clientPersonaContactoId: textSchema,
        clientEmailId:emailSchema,
        clientMobileId:telefonoSchema*/
      }
    }
  };
  /**
   * Get schema of single field
   * @public
   * @param {string} [sId] Id of the field
   * @param {string} [sStep] Id of the step 
   * @return {object} Schema of the single field
   */
  oSchemas.getSchemaById = function(sId, sStep) {
    if (oSchemas[sStep] !== undefined && oSchemas[sStep].properties[sId] !== undefined) {   
      let oSchemaElement = {
        properties: {}
      };
      let oSchemaTmp = {};
      $.extend(true, oSchemaTmp, oSchemas[sStep].properties[sId]);
      oSchemaElement.properties[sId] = oSchemaTmp;
      return oSchemaElement;
    }
    return null;
  };

  /**
   * Get schema of one step depending on parameters
   * @public
   * @param {object} [oParams] New validation schema options 
   * @return {object} New schema
   */
  oSchemas.getStep = function(oParams) {
    let oSchemaStep = {};
    $.extend(true, oSchemaStep, oSchemas[oParams.step]);
    
    if (oParams.aOptions !== undefined) {
      oParams.aOptions.forEach(oElement => {
        if (oElement.remove) {
          delete oSchemaStep.properties[oElement.elementId];
        } else {
          oSchemaStep.properties[oElement.elementId][oElement.property] = oElement.value; 
        }
      });
    }

    return oSchemaStep;
  };
  
  return oSchemas;
});
