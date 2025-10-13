# Angular Dashboard

Esta carpeta contiene la migración del panel construido originalmente en React hacia una aplicación Angular standalone.
El objetivo es mantener la misma estructura de componentes y dejar preparada la base para que solo tengas que añadir
los recursos estáticos (imágenes, íconos, etc.) de forma manual.

## Estructura

- `src/app/layout`: layout principal con barra lateral, cabecera y ruteo anidado.
- `src/app/pages/dashboard`: página de analíticas con tarjetas y gráficas basadas en ApexCharts.
- `src/app/pages/products`: catálogo de productos con tarjetas responsivas y badges de estado.
- `src/assets`: carpetas vacías con archivos `.gitkeep` para que coloques tus imágenes sin provocar conflictos.

Dentro de `src/assets/README.md` encontrarás el listado de nombres sugeridos para las imágenes de productos
(`product-1.webp`, `product-2.webp`, etc.). Solo debes copiar tus archivos en esas rutas y el dashboard los tomará
automáticamente.

## Scripts

Los scripts estándar se definen en `package.json`:

```bash
npm install
npm start      # ng serve
npm run build  # ng build
```

> Nota: en este entorno no se ejecutó `npm install`, pero los paquetes necesarios están listados para que puedas instalarlos localmente.

## Próximos pasos sugeridos

- Conectar servicios y endpoints reales.
- Añadir guards y manejo de autenticación.
- Migrar gradualmente más secciones reutilizando la misma filosofía de componentes.
