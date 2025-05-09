sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
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
        }

      



    });
});