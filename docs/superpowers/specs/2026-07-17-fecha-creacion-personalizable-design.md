# Fecha de creación personalizable en el pie del catálogo

**Fecha:** 2026-07-17

## Problema

Hoy el pie de cada página del catálogo muestra el mes y año en que se generó
(ej. "Julio 2026"), producido por `getFooterText()` en `app.js`. Eso no permite
saber con precisión el día en que se creó el documento, dato importante para
distinguir si un catálogo es anterior o posterior a un cambio de precios.

## Objetivo

Reemplazar ese texto por un campo de fecha **personalizable** por el usuario,
precedido por la leyenda **"Creado"**, mostrando el día exacto.

## Requisitos acordados

1. **Tipo de campo:** selector de fecha nativo (`<input type="date">`), solo día
   (sin hora).
2. **Valor inicial:** pre-cargado con la fecha de hoy; el usuario puede cambiarlo.
3. **Ubicación en el pie:** en **todas las páginas** (portada, índice, productos,
   aclaraciones), igual que el pie actual.
4. **Formato mostrado:** `Creado DD/MM/YYYY` (estilo argentino).

## Diseño

### UI (`index.html`)
- Nuevo `input-group` con `<label>Fecha de Creación</label>` y
  `<input type="date" id="creationDate">` dentro de la tarjeta
  "Configuración de la Portada".

### Estado (`app.js`)
- Agregar `state.creationDate` inicializado con la fecha de hoy en formato
  `YYYY-MM-DD`.
- Referencia DOM `ui.creationDate` y listener `change` que actualiza
  `state.creationDate`.
- Al iniciar, fijar el `value` del input a la fecha de hoy para que coincida con
  el estado.

### Pie de página (`app.js`)
- Modificar `getFooterText()` para devolver `Creado DD/MM/YYYY` a partir de
  `state.creationDate`.
- La conversión de `YYYY-MM-DD` a `DD/MM/YYYY` se hace partiendo el string
  (`split('-')`), **no** con `new Date()`, para evitar corrimientos de día por
  huso horario.
- Si `state.creationDate` está vacío (el usuario borró la fecha), `getFooterText()`
  devuelve cadena vacía (pie sin texto).

## Fuera de alcance
- No cambia la exportación a PDF, el matching de imágenes, ni las librerías.
- No se toca la lógica de índice/paginación.

## Archivos afectados
- `index.html`: 1 input nuevo.
- `app.js`: estado, referencia DOM, listener, inicialización y `getFooterText()`.
- `style.css`: solo si el input de fecha necesita ajuste visual.
