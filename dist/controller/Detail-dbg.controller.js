sap.ui.define([
    "delmex/zmmbascula/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/PDFViewer",
    "delmex/zmmbascula/util/formatter",
    'sap/ui/core/BusyIndicator'
], (BaseController, JSONModel, Filter, FilterOperator, MessageBox, PDFViewer, formatter, BusyIndicator) => {
    "use strict";

    /**
     * 
     * @param {typeof delmex.bascula.controller.BaseController} BaseController 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof delmex.zmmbascula.util.formatter} formatter
     * @param {typeof sap.ui.core.BusyIndicator} BusyIndicator
     */

    // Num doc: 80005849


    return BaseController.extend("delmex.zmmbascula.controller.Detail", {

        formatter: formatter,
        onInit() {

            let _catalogsModel = this.getCatalogsModel();
            this.getView().setModel(_catalogsModel, "catalogsModel");
            sap.ui.getCore().setModel(_catalogsModel, "catalogsModel");

            var oRouter = this.getRouter();

            oRouter.getRoute("RouteDetail").attachMatched(this._onObjectMatched, this);

            // Agregar PDF Viewer a la vista
            this._pdfViewer = new PDFViewer({
                title: "Vista previa del PDF"
            });
            this.getView().addDependent(this._pdfViewer);

            var _pdfStructureModel = new sap.ui.model.json.JSONModel();
            let _jsonPDF = this.get_JSON_PDF();
            //_pdfStructureModel.loadData("./model/PDF_Structure.json", false);
            _pdfStructureModel.setData(_jsonPDF);
            this.getView().setModel(_pdfStructureModel, "pdfStructureModel");

            let _settingsModel = this.detailSettingsModel();
            this.getView().setModel(_settingsModel, "settingsModel");


        },
        /* _onObjectMatched(oEvent) {

            var oArgs = oEvent.getParameter("arguments");
            var _folio = oArgs.folio;
            var _that = this;

            var _oModel = this.getView().getModel("zbasc");

            var _url = "/Folio('" + _folio + "')";

            _oModel.read(_url, {
                success: function (oData, Result) {
                    //MessageBox.error(oData.Folio);
                    let _oModel = new JSONModel();
                    _oModel.setData(oData);
                    _that.getView().setModel(_oModel, "basculaDetails");

                    BusyIndicator.hide();
                }, error: function (oError) {
                    MessageBox.error(oError);

                    BusyIndicator.hide();
                }
            });

        }, */

        _onObjectMatched: async function (oEvent) {
            const sFolio = oEvent.getParameter("arguments").folio;
        
            try {
                const oData = await this.loadFolioData(sFolio);
                // Puedes usar oData si necesitas hacer algo adicional
            } catch (oError) {
                // El error ya fue manejado con MessageBox, pero puedes hacer más si lo deseas
                console.error("Fallo al cargar el folio:", oError);
            }
        },
        

        goBackBtn() {
            this.goBack();
        },


        onShowPDF: function () {
            
            var _basculaDetails = this.getView().getModel("basculaDetails").getData();
            const c_buildPDF = true;

            /** Volver a cargar los datos desde backend */
            this.loadFolioData(_basculaDetails.Folio, c_buildPDF);

           
        },

        loadImageAsBase64: function (src, callback) {
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var dataURL = canvas.toDataURL('image/png');
                callback(dataURL);
            };
            img.src = src;
        },

        /**
    * Actualiza el campo NumeroDoc en la entidad 'Alta' usando el método PATCH.
    * Solo ejecuta el PATCH si existen tanto el folio como el número de documento.
    * Utiliza una llamada jQuery.ajax con CSRF token manual para cumplir con el backend ABAP.
    */
        onUpdateData: async function () {
            // Obtener el modelo OData configurado en el manifest (zbasc)
            const oODataModel = this.getView().getModel("zbasc");

            // Obtener el modelo local que contiene los datos actuales (incluye el Folio)
            const oJSONModel = this.getView().getModel("basculaDetails");

            // Extraer el folio (clave de la entidad) y el valor de NumeroDoc desde la vista
            const sFolio = oJSONModel?.getData()?.Folio;
            const sNumeroDoc = this.getView().byId("txt_NumeroDoc").getValue();

            // Validación: ambos valores son obligatorios
            if (!sFolio || !sNumeroDoc) {
                sap.m.MessageBox.warning(this.getResourceBundle().getText("message.folio_oc_requeridos"));
                return;
            }

            // Construcción del path OData y la URL completa para el PATCH
            const sEntityPath = `/Alta('${sFolio}')`;
            const sPAtchrequest = oODataModel.sServiceUrl + sEntityPath;

            // Cuerpo (payload) con los datos a actualizar
            const oPayload = {
                NumeroDoc: sNumeroDoc
            };

            try {
                // Obtener token CSRF para autorizar la modificación
                //let sServiceUrl = "/sap/opu/odata/sap/ZUI_BASCULA_SRV_V2/Folio('0')";
                //let sServiceUrl = "/e4a25f08-7b50-4795-a093-b83466778bb4.delmexbasculazmmbascula.delmexzmmbascula-0.0.1/sap/opu/odata/sap/ZUI_BASCULA_SRV_V2/Folio('0')";
                const sServiceUrl = this._getServiceUrl() + "/Folio('0')";
                const sToken = await this._fetchCsrfToken(sServiceUrl);

                // Enviar la petición PATCH usando jQuery.ajax
                await $.ajax({
                    url: sPAtchrequest, // ej: /sap/opu/odata/sap/ZUI_BASCULA_SRV_V2/Alta('123')
                    method: "PATCH",
                    headers: {
                        "X-CSRF-Token": sToken,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    data: JSON.stringify({
                        NumeroDoc: sNumeroDoc  // asegúrate de que sea exactamente como en el backend
                    }),
                    success: () => {
                        sap.m.MessageToast.show(this.getResourceBundle().getText("message.actualizacion_exitosa"));
                        oODataModel.refresh(true);
                    },
                    error: (oError, oMensaje) => {
                        let _mensaje = oError.responseJSON.error.message.value;
                        //sap.m.MessageBox.error(this.getResourceBundle().getText("message.error_patch"));
                        sap.m.MessageBox.error(_mensaje);
                    }
                });
                

            } catch (oError) {
                // Si falló la obtención del token CSRF
                console.error("❌ Error obteniendo CSRF Token:", oError);
                //sap.m.MessageBox.error(this.getResourceBundle().getText("message.error_csrf"));
            }
        },

        onBeforeRendering(){
            
        }




        /* onUpdateData: function () {
            // Obtener el modelo OData real por su nombre declarado en manifest.json
            const oODataModel = this.getView().getModel("zbasc");

            // Obtener el modelo local con los datos de detalle (donde está el Folio)
            const oJSONModel = this.getView().getModel("basculaDetails");

            // Validar existencia de datos
            if (!oJSONModel || !oJSONModel.getData || !oJSONModel.getData().Folio) {
                sap.m.MessageBox.warning("No se encontró el folio en el modelo 'basculaDetails'.");
                return;
            }

            const sFolio = oJSONModel.getData().Folio; // clave
            const sNumeroDoc = this.getView().byId("txt_NumeroDoc").getValue(); // nuevo valor

            if (!sNumeroDoc) {
                sap.m.MessageBox.warning("Número de documento no puede estar vacío.");
                return;
            }

            // Construir el path con clave primaria
            const sPath = `/Alta('${sFolio}')`;

            // Payload con el campo a actualizar
            const oPayload = {
                NumeroDoc: sNumeroDoc
            };

            // Ejecutar update usando el modelo OData
            oODataModel.update(sPath, oPayload, {
                success: () => {
                    sap.m.MessageToast.show("📄 Registro actualizado correctamente.");
                    oODataModel.refresh(true); // Refresca para que la vista recargue datos si es necesario
                },
                error: (oError) => {
                    const sMessage = oError?.message || "Ocurrió un error al actualizar.";
                    console.error("❌ Error al actualizar:", oError);
                    sap.m.MessageBox.error("Error al actualizar:\n" + sMessage);
                }
            });
        } */




    });
});