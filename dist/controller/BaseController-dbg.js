sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("delmex.zmmbascula.controller.BaseController", {

        onInit() {

            console.log("base controller");
        },
        getRouter: function(){
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        goBack: function(){
            var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();
            if(sPreviousHash !== undefined){
                history.go(-1);
            }else{
                var _bReplace = true;
                this.getRouter().navTo("RouteMain");
            }
        },

        getRequestModel(){
            let _requestModel = new JSONModel({
                "centro_ent": "",
                "tipo_ticket": "",
                "centro_sal": "",
                "material": ""


            });

            return _requestModel;
        },

        getCatalogsModel(){

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

        detailSettingsModel(){
            let _detailSettings = new JSONModel({
                falg_oc: false,
                flag_ov: false
            });

            return _detailSettings;
        }

      



    });
});