sap.ui.define(["sap/ui/core/format/DateFormat"], function (DateFormat) {
    "use strict";

    return {
        formatDate: function (value) {
            console.log("formatter: " + value);
            if (!value) {
                return "";
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
        }
    };
});
