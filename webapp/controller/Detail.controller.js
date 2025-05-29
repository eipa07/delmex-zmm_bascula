sap.ui.define([
    "delmex/zmmbascula/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/PDFViewer",
    "delmex/zmmbascula/util/formatter",
], (BaseController, JSONModel, Filter, FilterOperator, MessageBox, PDFViewer, formatter) => {
    "use strict";

    /**
     * 
     * @param {typeof delmex.bascula.controller.BaseController} BaseController 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof delmex.zmmbascula.util.formatter} formatter
     */

    // Num doc: 80005849


    return BaseController.extend("delmex.zmmbascula.controller.Detail", {

        formatter: formatter,
        onInit() {

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
        _onObjectMatched(oEvent) {

            /* Opcion 1
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").pathBascula),
                model: "zbasc"
            }); */


            /* Recibir parámetro folio y llamar el detalle al backend
             *Fue opcion 2 */

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
                }, error: function (oError) {
                    MessageBox.error(oError);
                }
            });

        },

        goBackBtn() {
            this.goBack();
        },


        onShowPDF: function () {
            //const { jsPDF } = window.jspdf;
            
            var doc = new jsPDF();
            var _pdf = this.getView().getModel("pdfStructureModel").getData().Structure;
            var _basculaDetails = this.getView().getModel("basculaDetails").getData();

            const pageWidth = doc.internal.pageSize.getWidth();

            // Coordenadas para centrar logo
            const imageWidth = 90;
            const imageHeight = 30;
            const imageCenter = (pageWidth - imageWidth) / 2;
            const marginRight = 10; // margen derecho (en mm)

            var _headerSize = 10;
            var _bodySize = 12;

            doc.setFontSize(_headerSize);


            // Coordenadas para centrar el texto de cabecera
            const _header_line1_Width = doc.getTextWidth(_pdf.Header.Line1);
            const _header_line1_Center = (pageWidth - _header_line1_Width) / 2;
            const _header_line2_Width = doc.getTextWidth(_pdf.Header.Line2);
            const _header_line2_Center = (pageWidth - _header_line2_Width) / 2;
            const _header_line3_Width = doc.getTextWidth(_pdf.Header.Line3);
            const _header_line3_Center = (pageWidth - _header_line3_Width) / 2;
            const _header_line4_Width = doc.getTextWidth(_pdf.Header.Line4);
            const _header_line4_Center = (pageWidth - _header_line4_Width) / 2;
            const _header_line5_Width = doc.getTextWidth(_pdf.Header.Line5);
            const _header_line5_Center = (pageWidth - _header_line5_Width) / 2;
            const _header_line6_Width = doc.getTextWidth(_pdf.Header.Line6);
            const _header_line6_Center = (pageWidth - _header_line6_Width) / 2;
            const _header_line7_Width = doc.getTextWidth(_pdf.Header.Line7);
            const _header_line7_Center = (pageWidth - _header_line7_Width) / 2;

            var _folio = _pdf.Body.Folio + _basculaDetails.Folio;




            // Coordenadas Folio

            const sPath = sap.ui.require.toUrl("delmex/zmmbascula/images/Logo.png");

            this.loadImageAsBase64(sPath, function (base64Img) {

                doc.addImage(base64Img, 'PNG', imageCenter, 20, imageWidth, imageHeight);

                /** Cabecera del PDF */


                doc.setTextColor(7, 31, 99); // Color Azul
                doc.setFont("helvetica", "bolditalic");    // fuente
                doc.text(_pdf.Header.Line1, _header_line1_Center, 70);
                doc.text(_pdf.Header.Line2, _header_line2_Center, 75);
                doc.text(_pdf.Header.Line3, _header_line3_Center, 80);
                doc.text(_pdf.Header.Line4, _header_line4_Center, 85);
                doc.text(_pdf.Header.Line5, _header_line5_Center, 90);
                doc.text(_pdf.Header.Line6, _header_line6_Center, 95);
                doc.text(_pdf.Header.Line7, _header_line7_Center, 100);


                doc.setFontSize(_bodySize); /** Tamaño de fuente */

                doc.text(_folio, pageWidth - (marginRight + 40), 115, {
                    align: "right"
                });


                /** Cuerpo del PDF */

                const _marginLeft = 20;


                var _placa = _pdf.Body.Placa;
                var _bruto1 = _pdf.Body.Bruto;
                var _bound = _pdf.Body.Bound;
                //var _fechaSalida_1 = _pdf.Body.Fecha_Hora_SALIDA_1 + _basculaDetails.FechaEntBas;
                var _fechaSalida_1 = _pdf.Body.Fecha_Hora_SALIDA_1;
                var _bruto = _pdf.Body.Bruto;
                var _called_Neto = _pdf.Body.Called_Neto;
                //var _fechaSalida_2 = _pdf.Body.Fecha_Hora_SALIDA_1 + _basculaDetails.fecha_sal_bas;
                var _fechaSalida_2 = _pdf.Body.Fecha_Hora_SALIDA_2;


                // Separador de miles
                _basculaDetails.Pesaje = this.formatter.formatNumberWithCommas(_basculaDetails.Pesaje.trim());
                _basculaDetails.Pesaje2 = this.formatter.formatNumberWithCommas(_basculaDetails.Pesaje2.trim());
                _basculaDetails.PesoNeto = this.formatter.formatNumberWithCommas(_basculaDetails.PesoNeto.trim());





                doc.setFont("helvetica", "italic");    // fuente


                doc.text(_placa, _marginLeft, 140); // X = 10 (desde el margen izquierdo)
                doc.text(_basculaDetails.Placa, _marginLeft + 30, 140);
                doc.text(_pdf.Helpers.Line, _marginLeft + 30, 141);

                doc.text(_bruto1, _marginLeft, 150);
                doc.text(_bound, _marginLeft, 155);
                doc.text(_basculaDetails.Pesaje.trim(), _marginLeft + 30, 155);
                doc.text(_pdf.Helpers.Line, _marginLeft + 30, 156);

                var _FechaEntBas = this.formatter.formatDate(_basculaDetails.FechaEntBas);

                doc.text(_fechaSalida_1, _marginLeft, 165);
                doc.text(_fechaSalida_2, _marginLeft, 170);
                doc.text(_FechaEntBas, 60, 170);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 171);

                doc.text(_placa, _marginLeft, 185);
                doc.text(_basculaDetails.Placa.trim(), _marginLeft + 30, 185);
                doc.text(_pdf.Helpers.Line, _marginLeft + 30, 186);


                doc.text(_bruto, _marginLeft, 200);
                doc.text(_basculaDetails.Pesaje2.trim(), _marginLeft + 30, 200);
                doc.text(_pdf.Helpers.Line, _marginLeft + 30, 201);



                doc.text(_called_Neto, _marginLeft, 215);
                doc.text(_basculaDetails.PesoNeto.trim(), _marginLeft + 40, 215);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 216);


                doc.text(_fechaSalida_1, _marginLeft, 225);
                doc.text(_fechaSalida_2, _marginLeft, 230);
                doc.text(_FechaEntBas, 60, 230);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 231);

                // Footer

                var _nombre = _pdf.Footer.Nombre;
                var _referencia_material = _pdf.Footer.Referencia_Material; // Orden de compra
                var _no_documento = _pdf.Footer.No_Doc; // Orden de venta



                doc.text(_nombre, _marginLeft, 250);
                doc.text(_basculaDetails.Conductor, 60, 250);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 251);

                doc.text(_placa, _marginLeft, 260);
                doc.text(_basculaDetails.Placa.trim(), 60, 260);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 261);


                doc.text(_referencia_material.trim(), _marginLeft, 270);
                doc.text(_basculaDetails.Material.trim(), 90, 270); // OC => NumeroDoc
                doc.text(_pdf.Helpers.Line, 90, 271);

                doc.text(_no_documento.trim(), _marginLeft, 280);
                doc.text(_basculaDetails.NumeroDoc.trim(), _marginLeft + 50, 280);
                doc.text(_pdf.Helpers.Line, _marginLeft + 50, 281);





                const pdfBlob = doc.output("blob");
                const pdfUrl = URL.createObjectURL(pdfBlob);

                this._pdfViewer.setSource(pdfUrl);
                //doc.save(_basculaDetails.Folio);
                this._pdfViewer.open();
            }.bind(this));
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
                let sServiceUrl = "/e4a25f08-7b50-4795-a093-b83466778bb4.delmexbasculazmmbascula.delmexzmmbascula-0.0.1/sap/opu/odata/sap/ZUI_BASCULA_SRV_V2/Folio('0')";
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
                        console.log("_mensaje: ", _mensaje);
                        //sap.m.MessageBox.error(this.getResourceBundle().getText("message.error_patch"));
                        sap.m.MessageBox.error(_mensaje);
                    }
                });
                

            } catch (oError) {
                // Si falló la obtención del token CSRF
                console.error("❌ Error obteniendo CSRF Token:", oError);
                //sap.m.MessageBox.error(this.getResourceBundle().getText("message.error_csrf"));
            }
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