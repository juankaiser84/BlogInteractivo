'use strict';

/* =========================================
   PUNTO DE ENTRADA
========================================= */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTheme();
  markActiveLink();
  initPosts();           // <-- Solo correrá en index.html
});

/* =========================================
   NAV MÓVIL (accesible, sin bloquear <a>)
========================================= */
/**
 * Inicializa el menú hamburguesa
 * - No bloquea la navegación de enlaces normales
 * - Cierra el menú al hacer click en cualquier enlace del nav
 */
function initNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('header nav ul'); // tu estructura actual
  if (!navToggle || !navMenu) return;

  // Accesibilidad
  navToggle.setAttribute('aria-expanded', 'false');

  const setOpen = (open) => {
    navMenu.classList.toggle('active', open);     // usa tu clase existente
    navToggle.setAttribute('aria-expanded', String(open));
  };

  // Estado inicial (cerrado en móvil)
  setOpen(false);

  // Abrir/cerrar
  navToggle.addEventListener('click', () => setOpen(!navMenu.classList.contains('active')));

  // Delegación: cerrar al click en cualquier enlace
  navMenu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    // NO hacemos preventDefault en enlaces normales (about.html / contact.html)
    setOpen(false);
  });
}

/* =========================================
   THEME TOGGLE (respeta localStorage)
========================================= */
/**
 * Alterna tema y recuerda preferencia
 */
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  if (!themeToggle) return;

  // Preferencia guardada
  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
  });
}

/* =========================================
   RESALTAR ENLACE ACTIVO
========================================= */
function markActiveLink() {
  const links = document.querySelectorAll('nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const isActive = href === current || (current === '' && href === 'index.html');
    link.setAttribute('aria-current', isActive ? 'page' : null);
  });
}

/* =========================================
   POSTS (solo en index.html)
========================================= */
/**
 * Inicializa listado, búsqueda y paginación
 * Solo corre si existe un contenedor [data-js="posts"]
 */
function initPosts() {
  const postsRoot      = document.querySelector('[data-js="posts"]');
  if (!postsRoot) return; // <-- Clave: si no hay contenedor, no corre

  const searchInput    = document.querySelector('#search');
  const resultsCounter = document.querySelector('#results-counter'); // aria-live="polite"
  // ⬇️ NUEVO: oculto al iniciar
  if (resultsCounter) resultsCounter.classList.add('visualmente-oculto');

  const btnMore        = document.querySelector('#load-more');
  const btnLess        = document.querySelector('#load-less');

  /** Estado */
  let all = [];
  let filtered = [];
  let page = 1;
  const pageSize = 3;

  /** Utilidades */
  const currentList = () => (filtered.length ? filtered : all);
  const sliceByPage = (list) => list.slice(0, page * pageSize);

  /** Render */
  function render(list) {
    // Reinicia contenido manteniendo el título
    postsRoot.innerHTML = `<h2 id="titulo-posts">Últimos Posts</h2>`;
    list.forEach(post => {
      const article = document.createElement('article');
      article.innerHTML = `
        <header>
          <h3>${post.title}</h3>
          <p>
            <time datetime="${post.date}">
              ${new Date(post.date).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' })}
            </time> · ${post.author}
          </p>
        </header>
        <p>${post.summary}</p>
        <footer><a href="${post.link}">Leer más →</a></footer>
      `;
      postsRoot.appendChild(article);
    });
    // Actualiza contador accesible (queda oculto si no se está buscando)
    if (resultsCounter) resultsCounter.textContent = `${list.length} resultados`;
    updateButtons();
  }

  function updateButtons() {
    const total = currentList().length;
    if (btnMore) btnMore.hidden = page * pageSize >= total;
    if (btnLess) btnLess.hidden = page <= 1;
  }

  /** Eventos */
  searchInput?.addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    filtered = term
      ? all.filter(p => p.title.toLowerCase().includes(term) || p.summary.toLowerCase().includes(term))
      : [];
    page = 1;
    render(sliceByPage(currentList()));

    // ⬇️ NUEVO: mostrar el contador solo cuando hay texto en la búsqueda
    if (resultsCounter) resultsCounter.classList.toggle('visualmente-oculto', term.length === 0);
  });

  btnMore?.addEventListener('click', () => {
    page++;
    render(sliceByPage(currentList()));
    btnMore.focus(); // devuelve el foco
  });

  btnLess?.addEventListener('click', () => {
    if (page > 1) page--;
    render(sliceByPage(currentList()));
    btnLess.focus();
  });

  /** Carga inicial */
  fetch('assets/data/posts.json')
    .then(r => r.json())
    .then(data => {
      all = Array.isArray(data) ? data : [];
      page = 1;
      render(sliceByPage(all));
    })
    .catch(err => {
      console.error('Error cargando posts:', err);
      postsRoot.insertAdjacentHTML('beforeend', `<p>No se pudieron cargar los posts.</p>`);
    });
}
