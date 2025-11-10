sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageBox) => {
    "use strict";

    return Controller.extend("delmex.zmmbascula.controller.BaseController", {

        onInit() {

            console.log("base controller");
        },
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        goBack: function () {
            var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
            if (sPreviousHash !== undefined && !sPreviousHash.includes("header")) {
                history.go(-1);
            } else {
                var _bReplace = true;
                this.getRouter().navTo("RouteMain");
            }
        },

        getRequestModel() {
            let _requestModel = new JSONModel({
                Folio: "",
                CentroEnt: "",
                Tipoticket: "",
                CentroSal: "",
                Material: "",
                NumeroDoc: "",
                Placa: "",
                FechaEntBas: "",
                FechaSalBas: ""
            });

            return _requestModel;
        },

        getCatalogsModel() {

            let _catalogsModel = new JSONModel({
                Proceso: {
                    1: "Entrada de Mercancía",
                    2: "Salida de Mercancía",
                    3: "Traslados de Mercancía",
                    4: "Venta de Chatarra",
                    5: "Serv de pesaje externo",
                    6: "Otros"
                },
                TipoTicket: {
                    1: "Ticket interno",
                    2: "Ticket externo"
                }
            });

            return _catalogsModel;

        },

        detailSettingsModel() {
            let _detailSettings = new JSONModel({
                flag_oc: false,
                flag_ov: false
            });

            return _detailSettings;
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        _fetchCsrfToken: function (sUrl) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: sUrl,
                    method: "GET",
                    headers: {
                        "X-CSRF-Token": "Fetch",
                        "Accept": "application/json"
                    },
                    success: function (_data, _status, xhr) {
                        let sToken = xhr.getResponseHeader("X-CSRF-Token");
                        if (sToken) {
                            resolve(sToken);
                        } else {
                            reject("No se recibió el token CSRF.");
                        }
                    },
                    error: reject
                });
            });
        },


        get_JSON_PDF() {



            return {
                "Structure": {
                    "Header": {
                        "Line1": "TICKET DE BASCULA",
                        "Line2": "LIBRAMIENTO SALTILLO - LAREDO #4030 GENERAL ESCOBEDO,",
                        "Line3": "N.L. C,P, 66072",
                        "Line4": "TEL: (81) 4057 5110",
                        "Line5": "WWW.DELMEX.MX",
                        "Line6": "",
                        "Line7": "",
                        "Line8": ""
                    },

                    "Body": {
                        "Folio": "FOLIO ",
                        "Placa": "PLACA ",
                        "Bound": "BOUND ",
                        "Fecha_Hora_SALIDA_1": "FECHA Y HORA ",
                        "Fecha_Hora_ENTRADA_1": "FECHA Y HORA ",
                        "Bruto": "BRUTO ",
                        "Called_Neto": "CALLED NETO ",
                        "Fecha_Hora_SALIDA_2": "DE SALIDA ",
                        "Fecha_Hora_ENTRADA_2": "DE ENTRADA ",

                        "Peso_De": "PESO DE",
                        "Peso_Entrada": "ENTRADA ",
                        "Peso_Salida": "SALIDA",
                        "Neto": "NETO"
                    },
                    "Footer": {
                        "Nombre": "NOMBRE: ",
                        "Referencia_De": "REFERENCIA DE ",
                        "Referencia_Material": "MATERIAL: ",
                        "No_De": "NO. DE ",
                        "No_Doc": "DOCUMENTO: "
                    },

                    "Helpers": {
                        "Line": "___________________________",
                        "FolioLine": "________________"
                    }
                }
            }
        },

        buildDate(oDate) {

            let oMonth = parseInt(oDate.getMonth()) + 1;
            oMonth = oMonth <= 9 ? "0" + oMonth.toString() : oMonth.toString();
            let oDay = parseInt(oDate.getDate());
            oDay = oDay <= 9 ? "0" + oDay.toString() : oDay.toString();
            let _returnDate = oDate.getFullYear().toString() + oMonth.toString() + oDay;

            return _returnDate;

        },

        _getServiceUrl: function () {
            const sModulePath = sap.ui.require.toUrl("delmex/zmmbascula");
            const sBase = sModulePath.split("/webapp")[0];

            // Devuelve algo como: /resources/ -> para BAS
            // o: /e4a25f08-xxxxxx.delmexbasculazmmbascula... -> en Work Zone

            return sBase + "/sap/opu/odata/sap/ZUI_BASCULA_SRV_V2";
        },


        /**
        * Consulta los datos de un folio en el servicio OData y los carga en el modelo "basculaDetails".
        * Retorna una Promise para poder usar async/await si se desea.
        * 
        * @param {string} sFolio - Folio a consultar
        * @returns {Promise} Resolución con los datos obtenidos, o rechazo con el error
        */
        loadFolioData: function (sFolio, c_buildPDF = false) {
            const _that = this;
            const oModel = this.getView().getModel("zbasc");
            const sUrl = `/Folio('${sFolio}')`;

            sap.ui.core.BusyIndicator.show();

            return new Promise(function (resolve, reject) {
                oModel.read(sUrl, {
                    success: function (oData) {
                        // Crear un modelo temporal con los datos recibidos
                        const oFolioModel = new sap.ui.model.json.JSONModel();
                        oFolioModel.setData(oData);

                        // Asignar el modelo a la vista con el nombre "basculaDetails"
                        if (_that.getView().getModel("basculaDetails")) {
                            _that.getView().getModel("basculaDetails").setData();

                        }

                        _that.getView().setModel(oFolioModel, "basculaDetails");
                        debugger;

                        if (c_buildPDF) {
                            _that.buildPDF(_that);
                        }

                        sap.ui.core.BusyIndicator.hide();
                        resolve(oData); // Resolver la promesa con los datos
                    },
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Error al obtener el folio.");
                        reject(oError); // Rechazar la promesa con el error
                    }
                });
            });
        },


        buildPDF: function (_that) {
            //const { jsPDF } = window.jspdf;



            var doc = new jsPDF();
            var _pdf = _that.getView().getModel("pdfStructureModel").getData().Structure;
            _that.getView().getModel("basculaDetails").refresh();
            var _basculaDetails = _that.getView().getModel("basculaDetails").getData();

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

            var _folio_text = _pdf.Body.Folio;
            var _folio = _basculaDetails.Folio;




            // Coordenadas Folio

            const sPath = sap.ui.require.toUrl("delmex/zmmbascula/images/Logo.png");

            _that.loadImageAsBase64(sPath, function (base64Img) {

                doc.addImage(base64Img, 'PNG', imageCenter, 20, imageWidth, imageHeight);

                /** Cabecera del PDF */


                doc.setTextColor(7, 31, 99); // Color Azul
                doc.setFont("helvetica", "bolditalic");    // fuente
                doc.text(_pdf.Header.Line1, _header_line1_Center, 70);
                doc.text(_pdf.Header.Line2, _header_line2_Center, 75);
                doc.text(_pdf.Header.Line3, _header_line3_Center, 80);
                doc.text(_pdf.Header.Line4, _header_line4_Center, 85);
                doc.text(_pdf.Header.Line5, _header_line5_Center, 90);
                //doc.text(_pdf.Header.Line6, _header_line6_Center, 95);
                //doc.text(_pdf.Header.Line7, _header_line7_Center, 100);


                doc.setFontSize(_bodySize); /** Tamaño de fuente */

                doc.text(_folio_text, marginRight + 150, 115, {
                    align: "right"
                });
                doc.text(_folio, marginRight + 155, 115, {
                    align: "right"
                });
                doc.text(_pdf.Helpers.FolioLine, marginRight + 149, 115);


                /** Cuerpo del PDF */

                const _marginLeft = 20;


                var _placa = _pdf.Body.Placa;
                var _bruto1 = _pdf.Body.Bruto;
                var _bound = _pdf.Body.Bound;
                var _fechaEntrada_1 = _pdf.Body.Fecha_Hora_ENTRADA_1
                var _fechaSalida_1 = _pdf.Body.Fecha_Hora_SALIDA_1;
                var _bruto = _pdf.Body.Bruto;
                var _called_Neto = _pdf.Body.Called_Neto;
                var _fechaEntrada_2 = _pdf.Body.Fecha_Hora_ENTRADA_2;
                var _fechaSalida_2 = _pdf.Body.Fecha_Hora_SALIDA_2;


                // Separador de miles
                let oPesaje = _that.formatter.formatNumberWithCommas(_basculaDetails.Pesaje.trim());
                _basculaDetails.Pesaje2 = _that.formatter.formatNumberWithCommas(_basculaDetails.Pesaje2.trim());
                _basculaDetails.PesoNeto = _that.formatter.formatNumberWithCommas(_basculaDetails.PesoNeto.trim());





                doc.setFont("helvetica", "italic");    // fuente


                //doc.text(_placa, _marginLeft, 140); // X = 10 (desde el margen izquierdo)
                doc.text(_pdf.Body.Peso_De, _marginLeft, 140); // X = 10 (desde el margen izquierdo)
                doc.text(_pdf.Body.Peso_Entrada, _marginLeft, 145);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 145);
                doc.text(oPesaje, _marginLeft + 40, 144);


                var _FechaEntBas = _that.formatter.formatDate(_basculaDetails.FechaEntBas);
                var _FechaSalBas = _that.formatter.formatDate(_basculaDetails.FechaSalBas);

                doc.text(_fechaEntrada_1, _marginLeft, 155);
                doc.text(_fechaEntrada_2, _marginLeft, 160);
                doc.text(_FechaEntBas, 60, 160);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 160);


                doc.text(_pdf.Body.Peso_De, _marginLeft, 170); // X = 10 (desde el margen izquierdo)
                doc.text(_pdf.Body.Peso_Salida, _marginLeft, 175);
                doc.text(_basculaDetails.Pesaje2, _marginLeft + 40, 175);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 175);


                doc.text(_pdf.Body.Neto, _marginLeft, 185); // X = 10 (desde el margen izquierdo)
                doc.text(_basculaDetails.PesoNeto, _marginLeft + 40, 185);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 185);



                doc.text(_fechaSalida_1, _marginLeft, 195);
                doc.text(_fechaSalida_2, _marginLeft, 200);
                doc.text(_FechaSalBas, 60, 200);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 200);




                // Footer

                var _nombre = _pdf.Footer.Nombre;
                var _referencia_De = _pdf.Footer.Referencia_De;
                var _referencia_material = _pdf.Footer.Referencia_Material; // Orden de compra
                var _no_de = _pdf.Footer.No_De; // Orden de venta
                var _no_documento = _pdf.Footer.No_Doc; // Orden de venta



                doc.text(_nombre, _marginLeft, 225);
                doc.text(_basculaDetails.Conductor, 60, 225);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 225);


                doc.text(_placa, _marginLeft, 235);
                doc.text(_basculaDetails.Placa.trim(), _marginLeft + 40, 235);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 235);


                doc.text(_referencia_De.trim(), _marginLeft, 245);
                doc.text(_referencia_material.trim(), _marginLeft, 250);
                doc.text(_basculaDetails.Material.trim(), _marginLeft + 40, 250); // OC => NumeroDoc
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 250);



                doc.text(_no_de.trim(), _marginLeft, 260);
                doc.text(_no_documento.trim(), _marginLeft, 265);
                doc.text(_basculaDetails.NumeroDoc.trim(), _marginLeft + 40, 265);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 265);





                //doc.text(_basculaDetails.Placa, _marginLeft + 30, 140);


                doc.text(_bruto1, _marginLeft + 100, 300);
                doc.text(_bound, _marginLeft + 100, 300);
                doc.text(_basculaDetails.Pesaje.trim(), _marginLeft + 100, 300);
                doc.text(_pdf.Helpers.Line, _marginLeft + 100, 300);






                doc.text(_bruto, _marginLeft, 300);
                doc.text(_basculaDetails.Pesaje2.trim(), _marginLeft + 30, 300);
                doc.text(_pdf.Helpers.Line, _marginLeft + 30, 300);



                doc.text(_called_Neto, _marginLeft, 300);
                doc.text(_basculaDetails.PesoNeto.trim(), _marginLeft + 40, 300);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 300);





                doc.text(_placa, _marginLeft, 300);
                doc.text(_basculaDetails.Placa.trim(), 60, 300);
                doc.text(_pdf.Helpers.Line, _marginLeft + 40, 300);










                const pdfBlob = doc.output("blob");
                const pdfUrl = URL.createObjectURL(pdfBlob);

                _that._pdfViewer.setSource(pdfUrl);
                //doc.save(_basculaDetails.Folio);
                _that._pdfViewer.open();
            }.bind(_that));
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








    });
});