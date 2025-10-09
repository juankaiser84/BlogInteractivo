---
name: "🛠️ Roadmap Admin & CRUD"
about: Backlog para panel de administración, CRUD y personalización
labels: ["admin", "roadmap", "enhancement"]
---

## Objetivo
Crear un **panel admin** para gestionar posts y configuración sin editar archivos a mano.

## Alcance (MVP)
- [ ] **Editor de posts (UI)**: título, resumen, categoría, imagen, fecha y slug.
- [ ] **Persistencia**:
  - Opción A (estático): escribir en `assets/data/posts.json` (con validación).
  - Opción B (server): **PHP** con endpoints (`/admin/api/posts`) y JSON.
- [ ] **CRUD**: crear, listar, editar, eliminar posts.
- [ ] **Subida de imágenes** (arrastrar y soltar) con redimensionado básico.
- [ ] **Autenticación simple** (sesión PHP o token) para proteger `/admin/`.
- [ ] **Previsualización** del post antes de guardar.
- [ ] **Validaciones**: campos requeridos, longitud, formatos de fecha, tamaño de imagen.

## Personalización (fase 2)
- [ ] Temas (paletas) editables desde Admin.
- [ ] Config SEO por post (title/description).
- [ ] Reordenar posts y fijar destacados.
- [ ] Export/backup de `posts.json`.

## Criterios de aceptación
- [ ] Crear post desde UI y verlo reflejado en la home.
- [ ] Editar post y persistir cambios.
- [ ] Eliminar post con confirmación.
- [ ] Acceso al admin restringido a usuario autenticado.

## Notas técnicas
- **Stack sugerido**: PHP 8.x + JSON como storage (simple).
- **Rutas**:
  - `GET /admin/` → UI
  - `GET /admin/api/posts` → lista
  - `POST /admin/api/posts` → crear
  - `PUT /admin/api/posts/{id}` → editar
  - `DELETE /admin/api/posts/{id}` → eliminar
- **Front Admin**: HTML/CSS/JS vanilla (mantener coherencia del proyecto).
