# Blog Interactivo

Blog personal de estilo de vida digital y aprendizaje en público.  
**Stack:** HTML5, CSS3 (BEM, mobile-first), JavaScript ES6+, JSON y PHP (backend local).

> 🔄 Estado actual: front estable + **switch automático** entre JSON estático y backend PHP **solo en local**.

---

## ✨ Características

- Diseño **responsive** (mobile-first).
- **Tema claro/oscuro** con toggle y persistencia (`localStorage`).
- **Búsqueda en tiempo real** (título y resumen).
- **Paginación progresiva**: cargar más / cargar menos.
- **Posts dinámicos** desde `assets/data/posts.json` o desde **backend PHP** (switch).
- Estructura **semántica** y accesible (roles/ARIA esenciales).
- Preparado para **SEO on-page** básico.
- Objetivo de rendimiento: **90+** en Lighthouse.

---

## 🧠 Cómo funciona el *switch* (JSON ↔ PHP)

El front intenta detectar `./Backend/api/env.php`:

1. Si responde `{ "APP_ENV": "php" }` → usa `./Backend/api/posts.php` (lectura desde PHP).
2. Si no existe o no responde JSON válido → **fallback** a `./assets/data/posts.json`.

Esto permite:
- **Live Server (127.0.0.1:5500)** → siempre JSON (no ejecuta PHP).
- **localhost** (XAMPP/WAMP/MAMP) → usa PHP si está disponible.

> Importante: la carpeta se llama **`Backend/`** (B mayúscula) en la raíz del proyecto.

---

## 🛠️ Puesta en marcha

### A) Estático (Live Server)
1. Abrir con VS Code.
2. **Go Live** → `http://127.0.0.1:5500/`.
3. Fuente de datos: `assets/data/posts.json`.

### B) Localhost con PHP
1. Copiar a la carpeta pública:
   - XAMPP: `C:\xampp\htdocs\BlogInteractivo\`
   - WAMP: `C:\wamp64\www\BlogInteractivo\`
   - MAMP: `...\Applications\MAMP\htdocs\BlogInteractivo\`
2. Visitar `http://localhost/BlogInteractivo/`
3. Endpoints:
   - `Backend/api/env.php` → `{"APP_ENV":"php"}`
   - `Backend/api/posts.php` → JSON de posts

---

## 🗂️ Estructura (resumen)

BlogInteractivo/
├─ assets/
│ ├─ css/ # style.css (BEM, variables CSS)
│ ├─ data/
│ │ ├─ posts.json # fuente estática de posts
│ │ └─ app-env.json # (opcional) forzar “static” en Live Server
│ ├─ img/
│ └─ js/
│ └─ main.js # menú, tema, búsqueda, paginación, switch de datos
├─ Backend/
│ └─ api/
│ ├─ env.php # {"APP_ENV":"php"}
│ └─ posts.php # lista de posts en JSON (GET)
├─ posts/ # páginas HTML de cada post
├─ about.html
├─ contact.html
├─ 404.html
└─ README.md


---

## 🚀 Roadmap

- [ ] SEO on-page: `<title>` por página, `meta description`, datos estructurados mínimos.
- [ ] Accesibilidad: `:focus-visible`, roles adicionales y contraste.
- [ ] Lighthouse ≥ 90 (Performance, A11y y SEO).
- [ ] (Opcional) CRUD en backend: crear/editar/borrar posts + panel `Backend/admin/`.
- [ ] Deploy front en GitHub Pages (modo JSON). Backend requerirá hosting con PHP.

---

## 🧪 Comandos Git útiles

```bash
git add .
git commit -m "feat: switch JSON↔PHP estable (Backend local)"
git push

📝 Cambios destacados

    Nuevo: backend PHP local (Backend/api/) con env.php + posts.php.

    Nuevo: switch automático de fuente (PHP ↔ JSON) con fallback seguro.

    Mejora: manejo de errores y A11Y (mensajes y aria-busy).

    Mantenimiento: rutas relativas y capitalización consistente.