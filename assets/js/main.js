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
  if (resultsCounter) resultsCounter.classList.add('visualmente-oculto'); // oculto al iniciar

  const btnMore        = document.querySelector('#load-more');
  const btnLess        = document.querySelector('#load-less');

  // === Optimizaciones MOBILE ===
  const isMobile = window.matchMedia('(max-width: 480px)').matches;
  const requestIdle = window.requestIdleCallback || (cb =>
    setTimeout(() => cb({ didTimeout: true, timeRemaining: () => 0 }), 200)
  );

  /** Estado */
  let all = [];
  let filtered = [];
  let page = 1;
  let pageSize = isMobile ? 2 : 3; // 2 en móvil para bajar trabajo inicial

  /** Utilidades */
  const currentList = () => (filtered.length ? filtered : all);
  const sliceByPage = (list) => list.slice(0, page * pageSize);

  /** Render (una sola pasada) */
  function render(list) {
    let html = `<h2 id="titulo-posts">Últimos Posts</h2>`;
    for (const post of list) {
      html += `
        <article>
          <header>
            <h3>${post.title}</h3>
            <p>
              <time datetime="${post.date}">${post.dateLabel}</time> · ${post.author}
            </p>
          </header>
          <p>${post.summary}</p>
          <footer><a href="${post.link}">Leer más →</a></footer>
        </article>
      `;
    }
    postsRoot.innerHTML = html;

    // Accesibilidad: contador
    if (resultsCounter) resultsCounter.textContent = `${list.length} resultados`;

    updateButtons();
  }

  function updateButtons() {
    const total = currentList().length;
    if (btnMore) btnMore.hidden = page * pageSize >= total;
    if (btnLess) btnLess.hidden = page <= 1;
  }

  // Debounce para búsqueda (ahorra trabajo en móviles)
  const debounce = (fn, wait = 150) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };

  /** Eventos */
  searchInput?.addEventListener('input', debounce((e) => {
    const term = e.target.value.trim().toLowerCase();
    filtered = term
      ? all.filter(p => p.title.toLowerCase().includes(term) || p.summary.toLowerCase().includes(term))
      : [];
    page = 1;
    render(sliceByPage(currentList()));
    if (resultsCounter) resultsCounter.classList.toggle('visualmente-oculto', term.length === 0);
  }, 150));

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
      // Precalcula la etiqueta de fecha UNA SOLA VEZ
      all = (Array.isArray(data) ? data : []).map(p => ({
        ...p,
        dateLabel: new Date(p.date).toLocaleDateString('es-ES', {
          day: 'numeric', month: 'long', year: 'numeric'
        })
      }));
      page = 1;

      // Si tienes el skeleton HTML, quítalo antes de renderizar contenido real
      document.querySelector('.posts-skeleton')?.remove();

      // Render inicial: 2 cards en móvil, 3 en desktop
      render(sliceByPage(all));

      // En móvil, completa la 3.ª card cuando el hilo esté libre
      if (isMobile && pageSize === 2) {
        requestIdle(() => {
          pageSize = 3;
          render(sliceByPage(all));
        });
      }
    })
    .catch(err => {
      console.error('Error cargando posts:', err);
      postsRoot.insertAdjacentHTML('beforeend', `<p>No se pudieron cargar los posts.</p>`);
    });
}
