# Blog Interactivo — Aprendizaje en público

Bitácora personal de mi viaje como desarrollador. Blog estático con posts dinámicos desde JSON, búsqueda en tiempo real, paginación progresiva y tema claro/oscuro con preferencia persistente.

> **Objetivo**: buenas prácticas desde el inicio (accesibilidad, rendimiento y SEO) y publicar el progreso “learning in public”.

---

## ✨ Características

- **HTML semántico** + navegación accesible (skip links, focus visible, roles/labels).
- **Tema claro/oscuro** (atributo `data-theme` en `<html>` + preferencia en `localStorage`).
- **Menú móvil (hamburguesa)** accesible.
- **Carga dinámica de posts** desde `assets/data/posts.json` (y compatible con backend más adelante).
- **Búsqueda en tiempo real** (debounce) por título y resumen.
- **Paginación progresiva**: *Cargar más* / *Cargar menos* + `IntersectionObserver`.
- **Sidebar** (Recientes + Categorías) generada desde los datos.
- **Anti-CLS**: `aspect-ratio` y *skeletons* de tarjetas.
- **Responsive** (mobile-first) y layout con **sidebar a la derecha** en ≥ 900px.
- Preparado para **GitHub Pages**.

---

## 🧱 Tecnologías

- **HTML5**, **CSS3 (BEM & variables CSS)**, **JavaScript ES6+**
- JSON como fuente de datos.
- Sin frameworks ni build step obligatorio.  
  (Opcional: puede convivir con un backend simple en PHP u otro lenguaje.)

---

📁 Estructura del proyecto

.
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── data/
│   │   └── posts.json
│   └── img/              # (opcional) imágenes
├── pages/                # (opcional) páginas internas
│   ├── about.html
│   └── contact.html
├── index.html
└── README.md

🗂️ Formato de posts.json

[
  {
    "id": 6,
    "title": "Carga dinámica desde JSON",
    "date": "2025-10-04",
    "author": "Juan Kaiser",
    "summary": "Cómo mostrar posts dinámicamente en HTML leyendo un archivo JSON.",
    "link": "./posts/json.html",
    "image": "./assets/img/posts/json.jpg",
    "category": "General"
  }
]

Recomendaciones

    id: número incremental.

    date: YYYY-MM-DD.

    category: string única (“General”, “JavaScript”, “CSS”, etc.) para que Sidebar agrupe bien.

🔍 Búsqueda, paginación y sidebar (resumen técnico)

    Búsqueda: input con debounce (ej. 250 ms) filtra en memoria por title y summary.

    Paginación: array de posts paginado en el estado (pageSize, pageIndex) + botones.

    Lazy/Auto “cargar más”: IntersectionObserver sobre un sentinel al final del listado.

    Sidebar:

        Recientes: últimos N por fecha.

        Categorías: conteo por category.

♿ Accesibilidad (WCAG 2.1 AA) — Checklist

Semántica: header, nav, main, article, aside, footer.

Focus visible y navegable con teclado.

Labels ARIA donde aplica (aria-label, aria-live, aria-expanded, aria-controls).

Colores con contraste ≥ 4.5:1.

prefers-reduced-motion: animaciones suaves/desactivadas.

    Imágenes con alt descriptivo; decorativas con alt="".

⚡ Rendimiento (meta Lighthouse 95–100)

Anti-CLS: aspect-ratio + skeletons.

Trabajo en JS minimal (vanilla, sin librerías pesadas).

(Pendiente) optimizar imágenes (dimensionadas, loading="lazy", formatos modernos).

(Pendiente) preconnect y dns-prefetch si hay fuentes/CDN.

    (Pendiente) metas SEO y meta theme-color.

🔎 SEO básico

En <head>:

<meta name="description" content="Blog Interactivo: aprendizaje en público sobre desarrollo web.">
<meta property="og:title" content="Blog Interactivo — Aprendizaje en público">
<meta property="og:description" content="Mi viaje como desarrollador: proyectos, notas y tutoriales.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://<usuario>.github.io/<repo>/">
<meta property="og:image" content="https://<usuario>.github.io/<repo>/assets/img/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://<usuario>.github.io/<repo>/">

🛠️ Flujo de trabajo con Git

Ramas

    main: estable.

    feat/*: nuevas funcionalidades.

    fix/*: correcciones.

    chore/*: tareas de mantenimiento.

Convenciones de commit (Conventional Commits):

feat: nueva funcionalidad
fix: corrección de bug
refactor: cambio interno sin nuevas features
style: formato (espacios, comas, etc.)
docs: documentación
chore: tooling, tareas menores

Ejemplo:

git switch -c feat/sidebar-layout-polish
git add assets/css/style.css assets/js/main.js index.html
git commit -m "fix(layout): sidebar estable en desktop y stretch del grid de posts"
git push -u origin feat/sidebar-layout-polish

🌐 Deploy en GitHub Pages

    En GitHub → Settings → Pages.

    Source: Deploy from a branch
    Branch: main → Folder: /root → Save.

    Espera la acción y abre https://<usuario>.github.io/<repo>/.

    Si usas rutas relativas, no necesitas configuración extra.

🧭 Roadmap

Página de post individual con MD/HTML parseado.

Filtros por categoría/etiqueta (combinables con búsqueda).

Paginación real por querystring (?page=2&search=...).

Mejoras Lighthouse (imágenes + metas).

Tests ligeros (DOM + utilidades).

    Automatizar deploy con GitHub Actions.

❓ Troubleshooting rápido

    Sidebar se baja / hueco raro en desktop: verifica que el grid del listado (clase .posts__grid) no tenga max-width ni margin: 0 auto en desktop; debe ocupar todo el ancho de su columna. En el style.css de esta versión ya está resuelto (layout ≥ 900px).

    Tema no persiste: borra localStorage y recarga; el atributo data-theme debe setearse apenas carga el HTML.

    Búsqueda vacía: confirma que posts.json se pueda leer (ruta correcta y sin CORS si sirves desde file://).

📄 Licencia

MIT © 2025 Juan Kaiser
