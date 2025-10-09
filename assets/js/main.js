/* eslint-disable no-console */
'use strict';

/**
 * Blog Interactivo — main.js
 * ------------------------------------------------------
 * - Menú móvil accesible
 * - Tema claro/oscuro (usa <html data-theme>)
 * - Carga de posts desde JSON o backend PHP (auto-switch)
 * - Búsqueda en tiempo real con debounce
 * - Paginación (cargar más / menos)
 * - Sidebar (Recientes + Categorías)
 * - Lazy Loading con IntersectionObserver
 * - Render “suave” con requestAnimationFrame (↓ TBT)
 *
 * Elementos esperados en index.html:
 *  #menuToggle, #mainNav, #themeToggle, #year
 *  #search-input, #posts-container, #results-counter
 *  #btn-load-more, #btn-load-less, #clear-filters-btn
 *  #empty-state, #load-sentinel
 *  #sidebar-recent, #sidebar-cats
 */

/* ======================================================
   UTILIDADES
   ====================================================== */

/** Acceso corto a querySelector */
const $ = (sel) => document.querySelector(sel);

/**
 * debounce(fn, wait) — retrasa la ejecución de fn hasta que
 * deje de ser llamada por 'wait' ms. Reduce trabajo en cada tecla.
 * @template {Function} F
 * @param {F} fn
 * @param {number} wait
 * @returns {F}
 */
function debounce(fn, wait = 180) {
  let t = 0;
  return function debounced(...args) {
    clearTimeout(t);
    // @ts-ignore
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/** Formatea ISO "2025-10-03" → "3 oct 2025" (es-ES) */
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    const txt = fmt.format(d).replace('.', '');
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  } catch {
    return iso;
  }
};

/** Fetch con timeout para evitar cuelgues en desarrollo */
async function fetchWithTimeout(url, options = {}, ms = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/* ======================================================
   REFERENCIAS DOM
   ====================================================== */
const els = {
  // header
  menuBtn: $('#menuToggle'),
  mainNav: $('#mainNav'),
  themeToggle: $('#themeToggle'),
  year: $('#year'),

  // búsqueda + listados
  searchInput: $('#search-input'),
  postsContainer: $('#posts-container'),
  resultsCounter: $('#results-counter'),
  btnMore: $('#btn-load-more'),
  btnLess: $('#btn-load-less'),
  emptyState: $('#empty-state'),
  clearFiltersBtn: $('#clear-filters-btn'),
  loadSentinel: $('#load-sentinel'),

  // sidebar
  sbRecent: $('#sidebar-recent'),
  sbCats: $('#sidebar-cats')
};

// Año dinámico en footer
if (els.year) els.year.textContent = new Date().getFullYear();

/* ======================================================
   MENÚ MÓVIL ACCESIBLE
   ====================================================== */
(function initNav() {
  const { menuBtn, mainNav } = els;
  if (!menuBtn || !mainNav) return;

  const toggle = () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    menuBtn.setAttribute('aria-expanded', String(next));
    mainNav.classList.toggle('nav--open', next);
    document.body.classList.toggle('overflow-hidden', next);
  };

  menuBtn.addEventListener('click', toggle);
})();

/* ======================================================
   TEMA CLARO / OSCURO
   (index.html ya fija data-theme ANTES del primer paint)
   Aquí solo sincronizamos el botón.
   ====================================================== */
(function initTheme() {
  const { themeToggle } = els;
  const root = document.documentElement;
  const STORAGE_KEY = 'theme-preference';

  const apply = (mode) => {
    root.setAttribute('data-theme', mode);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(mode === 'dark'));
      // Emojis: luna cuando estás en claro, sol cuando estás en oscuro
      themeToggle.textContent = mode === 'dark' ? '🌞' : '🌙';
    }
  };

  let mode = root.getAttribute('data-theme') || 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') mode = saved;
  } catch { /* ignore */ }

  apply(mode);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, mode); } catch {}
      apply(mode);
    });
  }
})();

/* ======================================================
   ESTADO DE APLICACIÓN
   ====================================================== */
const STATE = {
  /** @type {Array<{id:number,title:string,date:string,author:string,summary:string,link:string,image?:string,category?:string}>} */
  all: [],
  filtered: [],
  visibleCount: 4,
  step: 4,
  categories: new Map(),   // nombre -> cantidad
  builtSidebar: false
};

/* ======================================================
   RENDER DE TARJETAS
   ====================================================== */

/**
 * Crea el HTML de una tarjeta de post, usando contenedor con aspect-ratio
 * y tamaños fijos de imagen para bajar CLS.
 */
const renderCard = (post) => {
  const humanDate = formatDate(post.date);
  const a11yDate = post.date;
  const media = post.image
    ? `<div class="card__media media media--16x9">
         <img src="${post.image}" alt="" loading="lazy" decoding="async" width="640" height="360">
       </div>`
    : '';
  const cat = post.category ? `<span class="badge">${post.category}</span>` : '';

  return `
    <article class="card">
      ${media}
      <header class="card__header">
        <h2 class="card__title"><a href="${post.link}">${post.title}</a></h2>
        <p class="card__meta"><time datetime="${a11yDate}">${humanDate}</time> · ${post.author}</p>
      </header>
      <p class="card__excerpt">${post.summary}</p>
      <p class="card__actions">
        ${cat} <a class="btn btn--link" href="${post.link}" aria-label="Leer más: ${post.title}">Leer más →</a>
      </p>
    </article>
  `;
};


const updateCounter = () => {
  if (!els.resultsCounter) return;
  const total = STATE.filtered.length;
  const visible = Math.min(STATE.visibleCount, total);
  els.resultsCounter.textContent = total === 0
    ? 'Sin publicaciones'
    : `Mostrando ${visible} de ${total} publicaciones`;
};

let renderScheduled = false;
const render = () => {
  if (renderScheduled) return;
  renderScheduled = true;

  // Render diferido para no bloquear el hilo principal
  requestAnimationFrame(() => {
    const { postsContainer, emptyState, btnMore, btnLess } = els;
    if (!postsContainer) return;

    const toRender = STATE.filtered.slice(0, STATE.visibleCount);
    postsContainer.innerHTML = toRender.map(renderCard).join('');

    const isEmpty = STATE.filtered.length === 0;
    if (emptyState) emptyState.hidden = !isEmpty;

    if (btnMore) btnMore.disabled = STATE.visibleCount >= STATE.filtered.length;
    if (btnLess) btnLess.disabled = STATE.visibleCount <= STATE.step;

    updateCounter();

    const postsSection = postsContainer.closest('.posts');
    if (postsSection) postsSection.setAttribute('aria-busy', 'false');

    renderScheduled = false;
  });
};

/* ======================================================
   SIDEBAR (Recientes + Categorías)
   ====================================================== */
function computeCategories(posts) {
  const map = new Map();
  posts.forEach(p => {
    const cat = String(p.category || 'General');
    map.set(cat, (map.get(cat) || 0) + 1);
  });
  return map;
}

/** Construye "Recientes" (5 últimos) y "Categorías" */
function buildSidebar() {
  if (STATE.builtSidebar) return;

  // Recientes
  if (els.sbRecent) {
    const recent = STATE.all.slice(0, 5);
    els.sbRecent.innerHTML = recent.map(p => `
      <li class="sidebar__item">
        <a class="sidebar__link" href="${p.link}" title="${p.title}">${p.title}</a>
        <span class="sidebar__meta">${formatDate(p.date)}</span>
      </li>
    `).join('');
  }

  // Categorías
  STATE.categories = computeCategories(STATE.all);
  if (els.sbCats) {
    const items = [...STATE.categories.entries()].sort((a, b) => b[1] - a[1]);
    els.sbCats.innerHTML = items.map(([name, count]) => `
      <li>
        <button class="badge" data-cat="${name}" type="button" aria-pressed="false">${name} (${count})</button>
      </li>
    `).join('');

    // Filtro por categoría
    els.sbCats.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      const cat = btn.getAttribute('data-cat');
      if (!cat) return;

      // Marca visual
      els.sbCats.querySelectorAll('button[data-cat]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      // Mantiene búsqueda si hay texto
      const q = (els.searchInput?.value || '').trim().toLowerCase();
      STATE.filtered = STATE.all.filter(p => {
        const byCat = String(p.category || 'General') === cat;
        if (!q) return byCat;
        return byCat && (p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
      });

      STATE.visibleCount = Math.min(STATE.step, STATE.filtered.length || STATE.step);
      render();
    });
  }

  STATE.builtSidebar = true;
}

/* ======================================================
   LAZY LOADING con IntersectionObserver
   ====================================================== */
function initLazyLoading() {
  const sentinel = els.loadSentinel;
  if (!sentinel || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry.isIntersecting) return;

    if (STATE.visibleCount >= STATE.filtered.length) return; // ya no hay más

    STATE.visibleCount = Math.min(STATE.visibleCount + STATE.step, STATE.filtered.length);
    render();
  }, { rootMargin: '200px 0px 200px 0px' }); // dispara un poco antes

  io.observe(sentinel);
}

/* ======================================================
   BÚSQUEDA EN TIEMPO REAL
   ====================================================== */
const applySearch = (query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    STATE.filtered = STATE.all.slice();
  } else {
    STATE.filtered = STATE.all.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q)
    );
  }
  STATE.visibleCount = Math.min(STATE.step, STATE.filtered.length || STATE.step);
  render();
};

/* ======================================================
   EVENTOS DE UI
   ====================================================== */
const bindUI = () => {
  if (els.searchInput) {
    const onType = debounce((e) => applySearch(e.target.value), 300);
    els.searchInput.addEventListener('input', onType);
  }
  if (els.btnMore) {
    els.btnMore.addEventListener('click', () => {
      STATE.visibleCount = Math.min(STATE.visibleCount + STATE.step, STATE.filtered.length);
      render();
    });
  }
  if (els.btnLess) {
    els.btnLess.addEventListener('click', () => {
      STATE.visibleCount = Math.max(STATE.step, STATE.visibleCount - STATE.step);
      render();
    });
  }
  if (els.clearFiltersBtn) {
    els.clearFiltersBtn.addEventListener('click', () => {
      if (els.searchInput) els.searchInput.value = '';
      // Desmarca categorías activas
      els.sbCats?.querySelectorAll('button[data-cat]').forEach(b => b.setAttribute('aria-pressed', 'false'));
      applySearch('');
    });
  }
};

/* ======================================================
   DETECCIÓN DE BACKEND Y CARGA DE DATOS
   ====================================================== */
/**
 * Detecta si hay backend disponible en ./backend/api/env.php
 * y retorna la URL de datos adecuada.
 * - Live Server (sin PHP): usa ./assets/data/posts.json
 * - Localhost con PHP: si env.php responde {"APP_ENV":"php"} → usa ./backend/api/posts.php
 */
async function getPostsEndpoint() {
  try {
    const r = await fetchWithTimeout('./backend/api/env.php', { headers: { 'Accept': 'application/json' } }, 1200);
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      if (String(j?.APP_ENV || '').toLowerCase() === 'php') {
        return './backend/api/posts.php';
      }
    }
  } catch { /* sin backend, seguimos */ }
  return './assets/data/posts.json';
}

/**
 * Carga posts desde la URL indicada, ordena por fecha DESC y renderiza.
 * @param {string} dataUrl
 */
async function loadPosts(dataUrl) {
  const postsSection = els.postsContainer?.closest('.posts');
  if (postsSection) postsSection.setAttribute('aria-busy', 'true');

  try {
    const res = await fetch(dataUrl, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    STATE.all = (Array.isArray(data) ? data : []).map(p => ({
      id: Number(p.id) || 0,
      title: String(p.title || 'Sin título'),
      date: String(p.date || '2025-01-01'),
      author: String(p.author || 'Autor'),
      summary: String(p.summary || ''),
      link: String(p.link || '#'),
      image: p.image ? String(p.image) : undefined,
      category: p.category ? String(p.category) : 'General'
    }));

    // Ordenar por fecha DESC
    STATE.all.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Estado inicial
    STATE.filtered = STATE.all.slice();
    STATE.visibleCount = Math.min(STATE.step, STATE.filtered.length || STATE.step);

    render();
  } catch (err) {
    console.error('[Blog] Error cargando posts:', err);
    if (els.resultsCounter) els.resultsCounter.textContent = 'No se pudieron cargar las publicaciones.';
    if (els.emptyState) {
      els.emptyState.hidden = false;
      els.emptyState.querySelector('.empty__text')?.insertAdjacentText('beforeend', ' (Error de red o JSON inválido)');
    }
  }
}

/* ======================================================
   INICIO
   ====================================================== */
// LIGERO: listeners al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  bindUI();
  if (els.resultsCounter && !els.resultsCounter.textContent) {
    els.resultsCounter.textContent = 'Cargando publicaciones…';
  }
});

// PESADO: red y render cuando terminó de cargar la página
window.addEventListener('load', async () => {
  const DATA_URL = await getPostsEndpoint();
  await loadPosts(DATA_URL);

  // Construye sidebar y activa Lazy Loading (ya tenemos datos)
  buildSidebar();
  initLazyLoading();
});
