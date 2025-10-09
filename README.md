# Blog Personal · Aprendizaje en Público

Blog estático construido con **HTML5 + CSS3 + JavaScript (ES6+)** para documentar mi viaje como desarrollador.
Enfoque: *mobile-first*, accesibilidad básica, buen rendimiento y despliegue en **GitHub Pages**.

* **Producción:** [https://juankaiser84.github.io/BlogInteractivo/](https://juankaiser84.github.io/BlogInteractivo/)
* **Repositorio:** [https://github.com/juankaiser84/BlogInteractivo](https://github.com/juankaiser84/BlogInteractivo)

---

## ✨ Características

* Diseño **responsive** (mobile-first).
* **Tema claro/oscuro** con preferencia guardada en `localStorage`.
* **Menú hamburguesa** accesible (`aria-controls`, `aria-expanded`, cierre con `Escape`).
* **Posts dinámicos** desde `JSON`.
* **Búsqueda en tiempo real** con *debounce*.
* **Paginación** (*Cargar más* / *Cargar menos*).
* **Recientes** y **Categorías**.
* Buenas prácticas de **SEO on-page** (títulos, descripciones, `lang`, `viewport`).
* Consideraciones de **accesibilidad** (foco visible, live region de resultados, contraste).
* Rendimiento optimizado: carga en **lotes** (rAF) y **lazy-loading** de imágenes.

---

## 🗂️ Estructura

```
BlogInteractivo/
├─ index.html
├─ about.html
├─ contact.html
├─ 404.html                # (opcional; recomendado para Pages)
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  ├─ js/
│  │  └─ main.js           # lógica de menú, tema, búsqueda y paginación
│  ├─ data/
│  │  └─ posts.json        # fuente de posts
│  └─ img/                 # imágenes del sitio
└─ README.md
```

---

## ▶️ Ejecutar en local

1. Clona el repo y ábrelo en VS Code.
2. Inicia **Live Server** o abre `index.html` en tu navegador.

> Si ves estilos antiguos, fuerza recarga con **Ctrl/Cmd + F5** (cache bust).

---

## 🚀 Despliegue en GitHub Pages

1. En **Settings → Pages** del repo:

   * *Build and deployment* → **Deploy from a branch**
   * Branch: `main` · Folder: `/ (root)`
2. Usa **rutas relativas** en HTML/CSS/JS (`./assets/...`).
3. Para evitar caché, añade versión al cargar assets:

   ```html
   <link rel="stylesheet" href="./assets/css/style.css?v=YYYYMMDD">
   <script src="./assets/js/main.js?v=YYYYMMDD" defer></script>
   ```

**Publicar cambios**

```bash
git add -A
git commit -m "feat: update blog content and styles"
git push origin main
```

---

## 📊 Estado actual (Lighthouse)

* **Desktop:** Performance 100 · Accessibility 96 · Best Practices 100 · SEO 100
* **Mobile:** Performance 95 · Accessibility 96 · Best Practices 100 · SEO 100

Notas:

* **CLS** bajo gracias a `width/height` y `aspect-ratio` en imágenes.
* **TBT** móvil reducido por *debounce* y render en **lotes**.
* Pendiente menor: limpieza fina de ARIA si se añaden elementos nuevos.

---

## 🧩 Cómo agregar un post (JSON)

Edita `assets/data/posts.json` y añade un objeto con este formato:

```json
{
  "id": "post-007",
  "title": "Mi nueva entrada",
  "summary": "Resumen corto del post.",
  "author": "Juan Kaiser",
  "date": "2025-10-05",
  "category": "General",
  "image": "./assets/img/mi-imagen.jpg",
  "link": "./posts/mi-nueva-entrada.html"
}
```

Recomendaciones:

* Usa imágenes **16:9** y, si se insertan en HTML, incluye `width="640" height="360"` + `loading="lazy"`.

---

## ♿ Accesibilidad (WCAG 2.1 AA · básico)

* `lang="es"` y `meta viewport`.
* Foco visible para teclado.
* Live region única `role="status"` para el contador de resultados.
* Menú con `aria-controls`/`aria-expanded` y cierre con `Escape`.
* Contraste AA en botones/badges (texto oscuro sobre cyan, blanco sobre púrpura).
* Evitar ARIA redundante (no `aria-label` si el texto del link ya es claro).

---

## 🧠 Decisiones técnicas clave

* **Mobile-first:** CSS escala hacia *breakpoints* mayores.
* **Rendimiento:** *debounce* de búsqueda (300 ms) y render en **chunks** mediante `requestAnimationFrame`.
* **Estabilidad visual:** `aspect-ratio` + `width/height` reduce **CLS**.
* **Sin dependencias**: vanilla JS para mantener simple el flujo.

---

## 🛠️ Mantenimiento rápido

* **Cache bust** tras cambios en CSS/JS: actualiza `?v=YYYYMMDD`.
* Revisa rutas relativas `./assets/...` para que Pages resuelva bien.
* Si cambias IDs/clases en HTML, alinea los selectores en `main.js` y `style.css`.

---

## 🧭 Roadmap corto

* [ ] Página de **404** (si no está).
* [ ] Página de **Sobre mí** y **Contacto** completas.
* [ ] Filtros por **categoría** (opcional).
* [ ] Minificado opcional de `main.js` para silenciar avisos de “minify js (~2 KiB)”.
* [ ] Tests manuales de accesibilidad (navegación por teclado, lector NVDA/VoiceOver).

---

## 📦 Licencia

MIT — Úsalo y modifícalo libremente. Créditos apreciados 😊

---

## 👤 Autor

**Juan Kaiser** — Aprendizaje en público.
Feedback y mejoras son bienvenidos mediante *issues* o PRs.

