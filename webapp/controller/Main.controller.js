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

            var aFilters = [];

            var _centro_ent = this.getView().getModel("requestModel").getProperty("/centro_ent");
            var _tipo_ticket = this.getView().getModel("requestModel").getProperty("/tipo_ticket");
            var _centro_sal = this.getView().getModel("requestModel").getProperty("/centro_sal");
            var _material = this.getView().getModel("requestModel").getProperty("/material");

            if (_centro_ent) {
                aFilters.push(new Filter("CentroEnt", FilterOperator.EQ, _centro_ent));
            }
            if (_tipo_ticket) {
                aFilters.push(new Filter("Tipoticket", FilterOperator.EQ, _tipo_ticket));
            }
            if (_centro_sal) {
                aFilters.push(new Filter("CentroSal", FilterOperator.EQ, _centro_sal));
            }
            if (_material) {
                aFilters.push(new Filter("Material", FilterOperator.EQ, _material));
            }

            return aFilters;




        }
    });
});