# 📖 Blog Interactivo

Blog estático hecho con **HTML5, CSS3 y JavaScript ES6+** para documentar mi aprendizaje como desarrollador.  
Enfoque: **Learning in Public** y buenas prácticas desde el inicio (accesibilidad, rendimiento y SEO).

> Hosting: **GitHub Pages** · Enfoque **mobile-first** · Modo **claro/oscuro**

---

## ✨ Funcionalidades actuales

- **Diseño responsive (mobile-first)**
- **Tema claro/oscuro** con toggle y preferencia guardada en `localStorage`
- **Menú móvil accesible** (teclado, `aria-expanded`, cierre al navegar)
- **Posts dinámicos** desde `assets/data/posts.json`
- **Búsqueda en tiempo real** (con `aria-live` para resultados)
- **Paginación**: *Cargar más* / *Cargar menos*
- **Accesibilidad base**: HTML semántico, skip-link, foco visible, contrastes
- **SEO on-page**: títulos/metas únicos, OpenGraph/Twitter, `robots.txt`, `sitemap.xml`
- **Optimización**: render de una pasada, skeleton para estabilidad de layout, `defer`, `content-visibility`

> Nota: existen páginas `index.html`, `about.html` y `contact.html` (formulario básico, sin backend todavía).

---

## 📂 Estructura

BlogInteractivo/
├── index.html
├── about.html
├── contact.html
├── assets/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── main.js
│ ├── data/
│ │ └── posts.json
│ └── img/
└── README.md


---

## 🧪 Métricas Lighthouse (medición actual)

| Plataforma | Performance | Accessibility | Best Practices | SEO | Fecha |
|-----------|-------------|---------------|----------------|-----|-------|
| **Mobile** | **100** | **100** | **100** | **100** | 2025-10-07 |
| **Desktop** | **100** | **100** | **100** | **100** | 2025-10-07 |



---

## 🚀 Ejecutar en local

1. Abrir la carpeta en **VS Code**.  
2. Usar **Live Server** o abrir `index.html` en el navegador.

---

## 🌐 Deploy en GitHub Pages

1. Repo → **Settings → Pages**.  
2. **Build and deployment**: *Deploy from a branch*.  
3. **Branch**: `main` · **Folder**: `/ (root)`.

> Usa rutas **relativas** (`./about.html`, `./assets/...`) para que funcione en subcarpeta.

---

## 🗂️ Datos de posts

`assets/data/posts.json` (ejemplo):

```json
[
  {
    "title": "Primer post de ejemplo",
    "date": "2025-09-29",
    "author": "Juan Kaiser",
    "summary": "Este es un post de prueba para el Blog Interactivo.",
    "link": "./posts/primer-post.html"
  }
]


🗺️ Próximos pasos (no implementados aún)

Página 404.html para GitHub Pages

Envío real del formulario de contacto (servicio externo)

Etiquetas/categorías y filtros

RSS/JSON Feed



