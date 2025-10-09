# Blog Interactivo

Blog personal de estilo de vida digital y aprendizaje en público.  
**Stack:** HTML5, CSS3 (BEM, mobile-first), JavaScript ES6+, JSON y PHP (backend local).

> 🔄 Estado actual: front estable + **switch automático** entre JSON estático y backend PHP **solo en local**.

---

## ✨ Características

- Diseño **responsive** (mobile-first).
- **Tema claro/oscuro** con toggle y persistencia (`localStorage`).
- **Búsqueda en tiempo real** (título y resumen).
- **Paginación**: cargar más / cargar menos.
- **Posts dinámicos** desde `assets/data/posts.json` ó **backend PHP** (switch).
- Semántica + A11Y (roles/ARIA esenciales).
- Objetivo Lighthouse **90+** (Perf/A11Y/SEO).

---

## 🧠 Cómo funciona el *switch* (JSON ↔ PHP)

El front intenta `./backend/api/env.php`:

1. Si responde `{ "APP_ENV": "php" }` → usa `./backend/api/posts.php` (lectura desde PHP).
2. Si no responde o no es JSON válido → **fallback** a `./assets/data/posts.json`.

Así:
- **Live Server (127.0.0.1:5500)** → siempre JSON (no ejecuta PHP).
- **localhost** (XAMPP/WAMP/MAMP) → usa PHP si está disponible.

> La carpeta es **`backend/`** (minúsculas), en la **raíz** del proyecto.

---

## 🛠️ Puesta en marcha

### A) Estático (Live Server)
1. Abrir con VS Code → **Go Live**.
2. Visitar `http://127.0.0.1:5500/`.
3. Fuente de datos: `assets/data/posts.json`.

### B) Localhost con PHP
1. Copiar a la carpeta pública:
   - XAMPP: `C:\xampp\htdocs\BlogInteractivo\`
   - WAMP: `C:\wamp64\www\BlogInteractivo\`
   - MAMP: `...\Applications\MAMP\htdocs\BlogInteractivo\`
2. Visitar `http://localhost/BlogInteractivo/`
3. Endpoints:
   - `backend/api/env.php` → `{"APP_ENV":"php"}`
   - `backend/api/posts.php` → lista de posts (JSON)

---

## 🗂️ Estructura (resumen)

BlogInteractivo/
├─ assets/
│ ├─ css/
│ ├─ data/
│ │ ├─ posts.json
│ │ └─ app-env.json # opcional (forzar “static”), está en .gitignore
│ ├─ img/
│ └─ js/
│ └─ main.js # menú, tema, búsqueda, paginación y switch
├─ backend/
│ └─ api/
│ ├─ env.php # {"APP_ENV":"php"}
│ └─ posts.php # GET posts en JSON
├─ posts/
├─ about.html
├─ contact.html
├─ 404.html
└─ README.md


---

## 🚀 Roadmap

- [ ] SEO on-page: `<title>` por página, `meta description`, datos estructurados mínimos.
- [ ] Accesibilidad: `:focus-visible`, roles adicionales y contraste.
- [ ] Lighthouse ≥ 90 (Perf, A11y y SEO).
- [ ] (Opcional) CRUD backend: crear/editar/borrar + panel `/backend/admin/`.
- [ ] Deploy front en GitHub Pages (modo JSON). Backend necesita hosting con PHP.

---

## 🧪 Comandos Git útiles

```bash
git add .
git commit -m "feat: backend local + switch JSON↔PHP"
git push

📝 Cambios destacados (esta versión)

    Nuevo: backend PHP local (backend/api/) con env.php + posts.php.

    Nuevo: switch automático (PHP ↔ JSON) con fallback seguro.

    Docs: README y .gitignore.

    Mantenimiento: rutas relativas y backend/ en minúsculas.