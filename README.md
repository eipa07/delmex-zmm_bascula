# Proyecto SAPUI5 - ZMM_BASCULA

Este proyecto es una aplicación Fiori desarrollada con SAPUI5 bajo el namespace `delmex.zmmbascula`. Forma parte de un proceso logístico para gestionar tickets de entrada/salida de mercancía, materiales y centros de acopio.

---

## 🚀 Características principales

- Vista principal con filtro inteligente (`FilterBar`) y tabla de resultados.
- Columnas enriquecidas con mapeo de catálogo usando `formatter.js`.
- Soporte para i18n en textos dinámicos como `"Sin dato"`.
- Estructura modular conforme a [SAPUI5 Best Practices](https://ui5.sap.com/#/topic).

---

## 📁 Estructura del proyecto

```plaintext
webapp/
├── controller/
│   ├── BaseController.js
│   ├── Main.controller.js
│   └── Detail.controller.js
├── i18n/
│   ├── i18n.properties
│   └── i18n_en.properties (y otras variantes)
├── model/
│   ├── formatter.js      ← lógica de presentación con i18n
│   └── models.js
├── view/
│   └── Main.view.xml     ← contiene tabla con binding y formatter
```

---

## 🧠 `formatter.js` con i18n

El archivo `formatter.js` permite:

- Capitalizar descripciones (`Entrada de mercancía`, `Ticket externo`)
- Reemplazar valores nulos o vacíos por el texto internacionalizado `"Sin dato"`

### 🛠 Ejemplo de uso:

```xml
<Text text="{
  parts: ['detailsModel>Proceso'],
  formatter: '.formatter.getProcesoDescripcion'
}" />
```

### 📦 Requiere esta entrada en `i18n.properties`:

```
formatter.noData=Sin dato
```

---

## 📌 Buenas prácticas aplicadas

- ✔ Modularización con `formatter.js`
- ✔ Uso de `i18n` para textos dinámicos
- ✔ Separación de modelos locales (`catalogsModel`)
- ✔ `growing=true` y `growingScrollToLoad=true` en tablas para UX fluida
- ✔ Validación visual de campos vacíos

---

## 💡 Recomendaciones para segunda etapa

| Mejora | Descripción |
|--------|-------------|
| 🎨 `ObjectStatus` en columna Proceso | Mostrar color visual por tipo de proceso |
| 📤 Exportación Excel | Usar `sap.ui.export.Spreadsheet` |
| 📱 Adaptabilidad extra | Posibilidad de mobile view con `ResponsiveTable` |
| 🧪 Tests unitarios | Añadir pruebas QUnit para formatter |

---

## Proceso de Build y Deploy
• Paso 1: npm install && npm run build
• Paso 2: mbt build (genera .mtar)
• Paso 3: cf login && cf deploy archivo.mtar

## 📎 Autoría

Este proyecto fue trabajado por **Erick Piña**.

