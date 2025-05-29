sap.ui.define([
    "delmex/zmmbascula/controller/BaseController",
    "delmex/zmmbascula/util/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
]

/**
     * @param {typeof delmex.zmmbascula.controller.BaseController} BaseController 
     * @param {typeof delmex.zmmbascula.model.formatter} formatter 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.m.MessageBox} MessageBox
     */

, (BaseController, formatter, JSONModel, Filter, FilterOperator, MessageBox) => {
    "use strict";

    return BaseController.extend("delmex.zmmbascula.controller.Main", {

        formatter: formatter,

        onInit() {

            let _requestModel = this.getRequestModel();
            this.getView().setModel(_requestModel, "requestModel");

            let _catalogsModel = this.getCatalogsModel();
            this.getView().setModel(_catalogsModel, "catalogsModel");
            sap.ui.getCore().setModel(_catalogsModel, "catalogsModel"); // ✅ Necesario para que el formatter funcione globalmente


        },

        navToDetail(oEvent) {
             /* opcion 2 ++++++ */

             var oItem = oEvent.getSource();
             var oBindingContext = oItem.getBindingContext("detailsModel");
            var _odata = oBindingContext.getProperty(oBindingContext.getPath()); // Obtener solo el folio de la posicion del odata seleccioando
            var _folio = _odata.Folio;
            this.getRouter().navTo("RouteDetail", {
                folio: _folio
            }, false);
            
        },

        onSearch() {

            var _filters = this.getFilters();
            var _that = this;
            var _oModel = this.getView().getModel("zbasc");
            const _url = "/Folio";
            var detailsModel = new JSONModel();

            



            _oModel.read(_url, {
                filters: _filters,
                success: function (oData, Result) {                  
                    detailsModel.setData(oData.results);
                    _that.getView().setModel(detailsModel, "detailsModel");
                }, error: function (oError) {
                    sap.m.MessageBox.error(oError);
                }
            });

        },


        getFilters() {

            let aFilters = [];

            let oFolio = this.getView().getModel("requestModel").getProperty("/Folio");
            let oCentroEnt = this.getView().getModel("requestModel").getProperty("/CentroEnt");
            let oTipoticket = this.getView().getModel("requestModel").getProperty("/Tipoticket");
            let oCentroSal = this.getView().getModel("requestModel").getProperty("/CentroSal");
            let oMaterial = this.getView().getModel("requestModel").getProperty("/Material");

            let oNumeroDoc = this.getView().getModel("requestModel").getProperty("/NumeroDoc");
            let oPlaca = this.getView().getModel("requestModel").getProperty("/Placa");
            let oFechaEntBas = this.getView().getModel("requestModel").getProperty("/FechaEntBas");
            let oFechaSalBas = this.getView().getModel("requestModel").getProperty("/FechaSalBas");


            if (oFolio) {
                aFilters.push(new Filter("Folio", FilterOperator.EQ, oFolio));
            }
            if (oCentroEnt) {
                aFilters.push(new Filter("CentroEnt", FilterOperator.EQ, oCentroEnt));
            }
            if (oTipoticket) {
                aFilters.push(new Filter("Tipoticket", FilterOperator.EQ, oTipoticket));
            }
            if (oCentroSal) {
                aFilters.push(new Filter("CentroSal", FilterOperator.EQ, oCentroSal));
            }
            if (oMaterial) {
                aFilters.push(new Filter("Material", FilterOperator.Contains, oMaterial));
            }
            if (oNumeroDoc) {
                aFilters.push(new Filter("NumeroDoc", FilterOperator.EQ, oNumeroDoc));
            }
            if (oPlaca) {
                aFilters.push(new Filter("Placa", FilterOperator.Contains, oPlaca));
            }
            if (oFechaEntBas) {
                aFilters.push(new Filter("FechaEntBas", FilterOperator.Contains, oFechaEntBas));
            }
            if (oFechaSalBas) {
                aFilters.push(new Filter("FechaSalBas", FilterOperator.Contains, oFechaSalBas));
            }


            return aFilters;




        }
    });
});