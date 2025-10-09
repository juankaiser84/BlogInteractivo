# Changelog

Formato basado en _Keep a Changelog_. Versionado semántico.

## [0.4.0] - 2025-10-09
### Añadido
- Live region única `role="status"` para el contador de resultados.
- Atributos `width/height` y `aspect-ratio` 16:9 en miniaturas (reduce CLS).
- Debounce de búsqueda a 300 ms.
- Render de tarjetas en lotes con `requestAnimationFrame`.

### Cambiado
- Limpieza de ARIA redundante (botón menú con `aria-controls/aria-expanded` y sin ARIA innecesaria en enlaces).
- Contraste AA en badges y botones (texto negro sobre cian, blanco sobre púrpura).

### Corregido
- Variación de layout entre local y Pages mitigada (caché + orden de assets).
- Caídas de performance por listeners globales (eliminado monkey-patch).
- Menús accesibles: cierre con `Escape`, foco visible.

### Métricas (Lighthouse)
- **Desktop:** Perf 100 · A11y 96 · BP 100 · SEO 100 · TBT 0 ms · CLS 0.018
- **Mobile:** Perf 95 · A11y 96 · BP 100 · SEO 100 · TBT 260 ms · CLS 0

## [0.3.1] - 2025-10-08
### Cambiado
- Congelado de layout “estable local” antes de ajustes en Pages.
- Paginación (cargar más/menos) ajustada y búsqueda en tiempo real.

## [0.3.0] - 2025-10-03
### Añadido
- Tema claro/oscuro con `localStorage`.
- Menú hamburguesa responsive.
- Carga dinámica de posts desde `assets/data/posts.json`.

## [0.2.0] - 2025-10-01
### Añadido
- Estructura semántica inicial (home, sidebar, cards, header/footer).
- Variables CSS y estilos base mobile-first.

## [0.1.0] - 2025-09-30
### Inicial
- Boot del proyecto: HTML/CSS/JS mínimos y repo en GitHub.
