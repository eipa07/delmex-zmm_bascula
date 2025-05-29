sap.ui.define(["sap/ui/core/format/DateFormat", "sap/ui/model/resource/ResourceModel"], function (DateFormat, ResourceModel) {
    "use strict";

    /**
    * Capitaliza la primera letra de cada palabra.
    * @param {string} text
    * @returns {string}
    */
    function capitalize(text) {
        if (!text || typeof text !== "string") return text;
        return text.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
    }

    /**
     * Obtiene el texto "Sin dato" desde el i18n global.
     * @returns {string}
     */
    function getNoDataText() {
        const oBundle = sap.ui.getCore().getModel("i18n")?.getResourceBundle();
        return oBundle?.getText("formatter.noData") || "";
    }
    

    return {

        formatDate: function (value) {
            console.log("formatter: " + value);
            if (!value || value.length < 15) {
                return getNoDataText();
            }

            // Esperado: "20250410T103723"
            var year = value.substring(0, 4);
            var month = value.substring(4, 6); // 01-12
            var day = value.substring(6, 8);
            var hour = value.substring(9, 11);
            var minute = value.substring(11, 13);
            var second = value.substring(13, 15);

            var jsDate = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
            );

            var oDateFormat = DateFormat.getDateTimeInstance({
                pattern: "dd/MM/yyyy HH:mm:ss"
            });

            console.log(oDateFormat.format(jsDate));
            return oDateFormat.format(jsDate);
        },


        /**
         * Devuelve la descripción del proceso capitalizada o "Sin dato"
         * @param {string|number} iValue
         * @returns {string}
         */
        getProcesoDescripcion: function (iValue) {
            const oCatalogs = sap.ui.getCore().getModel("catalogsModel").getProperty("/Proceso") || {};
            const value = oCatalogs[iValue];
            return value ? capitalize(value) : getNoDataText();
        },

        /**
         * Devuelve la descripción del tipo de ticket o "Sin dato"
         * @param {string|number} iValue
         * @returns {string}
         */
        getTipoTicketDescripcion: function (iValue) {
            const oCatalogs = sap.ui.getCore().getModel("catalogsModel").getProperty("/TipoTicket") || {};
            const value = oCatalogs[iValue];
            console.log("Tipo Ticket: " + value)
            return value ? capitalize(value) : getNoDataText();
        },

        trimValue: function (sValue) {
            return sValue ? sValue.trim() : "";
        },

        formatNumberWithCommas: function (valor) {
            if (valor === null || valor === undefined || isNaN(valor)) {
              return "";
            }
          
            const partes = valor.toString().split(".");
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return partes.join(".");
          }
          
        
    };
});
