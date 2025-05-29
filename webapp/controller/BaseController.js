sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
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
            if (sPreviousHash !== undefined) {
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
                falg_oc: false,
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


        get_JSON_PDF(){



            return {
                "Structure": {
                    "Header": {
                        "Line1": "AV. ÁNGEL MARTÍNEZ VILLAREAL #637 INT. S2",
                        "Line2": "COL. CHEPEVERA C.P. 64030 MONTERREY N. L. MÉXICO",
                        "Line3": "RFC GDE091112HA8",
                        "Line4": "LIBRAMIENTO NOROESTE # 4030, PARQUE INDUSTRIAL ESCOBEDO",
                        "Line5": "GENERAL ESCOBEDO, N.L. C.P. 66072",
                        "Line6": "TEL: (81) 4057 5110",
                        "Line7": "E-MAIL: CALIDAD@DELMEX.MX CREDITOS@DELMEX.MX",
                        "Line8": "WWW.DELMEX.MX" 
                    },
            
                    "Body": {
                        "Folio": "FOLIO ",
                        "Placa": "PLACA ",
                        "Bound": "BOUND ",
                        "Fecha_Hora_SALIDA_1": "FECHA Y HORA ",
                        "Bruto": "BRUTO ",
                        "Called_Neto": "CALLED NETO ",
                        "Fecha_Hora_SALIDA_2": "DE SALIDA "
                    },
                    "Footer": {
                        "Nombre": "NOMBRE ",
                        "Referencia_Material": "REFERENCIA DE MATERIAL ",
                        "No_Doc": "NO. DE DOCUMENTO "
                    },
            
                    "Helpers": {
                        "Line": "___________________________"
                    }
                }
            }
        }
        






    });
});