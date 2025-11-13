# AllTax - Dashboard de Reviews

## Descripción

Aplicación web que muestra un dashboard interactivo con gráficos de reviews de productos basado en filtros en cascada.

## Características

### Filtros en Cascada
- **3 menús desplegables** que se actualizan dinámicamente:
  1. **Categoría**: Selección de categoría de productos
  2. **Marca**: Filtrado por marca según la categoría seleccionada
  3. **Tipo de Reviews**: Filtro por tipo (Todas, Positivas, Negativas)

### Visualización
- **Gráfico de barras** que muestra reviews por mes
- **Datos en tiempo real** basados en los filtros seleccionados
- **Responsive design** que se adapta al tamaño del contenedor

## Requisitos

- Cada select debe tener **al menos 3 opciones**
- Los filtros se actualizan en **cascada**
- El gráfico muestra **número de reviews por mes** según los filtros aplicados

## Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos (Water.css framework)
- **JavaScript ES6** - Lógica y interactividad
- **Chart.js** - Visualización de gráficos
- **DummyJSON API** - Fuente de datos

## Estructura del Proyecto

```
AllTax/
├── index.html          # Página principal
├── style.css           # Estilos personalizados
├── script.js           # Lógica principal
├── api.js             # Wrapper para llamadas API
├── utils.js           # Funciones utilitarias
└── README.md          # Documentación
```