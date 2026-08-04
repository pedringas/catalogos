# Selector "Mostrar precio Sí/No"

## Objetivo
Permitir que el usuario oculte el precio en el catálogo generado, para casos donde solo quiere mostrar el listado visual de productos (imagen, código, título, UE) sin información de precio.

## Estado
Nuevo campo `state.showPrice` (boolean, default `true`). Se agrega junto a `priceScale` y `priceLegend` en `app.js`.

## UI
Checkbox "Mostrar precio en el catálogo", ubicado en la tarjeta "Planilla y Modelo" de `index.html`, arriba de la zona de carga del Excel/CSV (`#csvDropZone`). Marcado por defecto.

```html
<div class="input-group show-price-toggle">
    <label class="checkbox-label">
        <input type="checkbox" id="showPriceToggle" checked>
        Mostrar precio en el catálogo
    </label>
</div>
```

## Comportamiento
- Al desmarcar el checkbox (`state.showPrice = false`):
  - Se ocultan (vía `display:none`) los controles "Tamaño Precio" (`#priceScaleGroup`) y "Leyenda de Precio" (`#priceLegendGroup`), ubicados en la tarjeta "Diseño del Catálogo", ya que no aplican sin precio visible.
  - La lectura del Excel/CSV no cambia: las columnas `Precio`/`PrecioOferta` se siguen parseando en `processMatchedProducts()` igual que siempre, así si el usuario vuelve a activar el checkbox no hace falta recargar el archivo.
- El cambio se aplica la próxima vez que se genere el catálogo (botón "Generar Catálogo") o se exporte a PDF, siguiendo el mismo patrón que el resto de las opciones de estilo (tema, sliders) — no hay re-render en vivo de una vista previa ya generada.

## Render (`renderCatalog`, app.js)
Cuando `state.showPrice` es `false`, se omite por completo en cada tarjeta de producto:
- el badge `¡OFERTA!`
- todo el bloque `.product-price` (precio normal, precio tachado + precio de oferta, leyenda +IVA/Final)

El resto de la tarjeta (imagen, código, título, UE) no cambia.

## Export a PDF
Sin cambios adicionales: `renderCatalog` se reutiliza para `#exportBuffer`, por lo que el comportamiento se hereda automáticamente en el PDF exportado.

## Verificación
Probado en local (`python -m http.server`) inyectando datos de prueba (2 productos, uno con oferta) y alternando el checkbox:
- Con precio activado: se ve código, badge ¡OFERTA!, precio tachado, precio de oferta y leyenda +IVA.
- Con precio desactivado: se ve solo código, título y UE — sin precio ni badge.
