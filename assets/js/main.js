/* eslint-disable no-console */
'use strict';

/**
 * Blog Interactivo – JS principal
 * - Menú móvil accesible
 * - Tema claro/oscuro con persistencia
 * - Carga de posts desde JSON o Backend PHP (switch)
 * - Búsqueda en tiempo real
 * - Paginación (cargar más / menos)
 *
 * IDs esperados en index.html:
 *  - #search-input, #posts-container, #btn-load-more, #btn-load-less
 *  - #results-counter, #empty-state, #clear-filters-btn
 *  - #menuToggle, #mainNav, #themeToggle, #year
 */

/* =========================================================================
   UTILIDADES
   ========================================================================= */
const $ = (sel) => document.querySelector(sel);

/** Convierte "2025-10-01" → "1 oct 2025" (capitalizando) */
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

/** Fetch con timeout para evitar cuelgues */
async function fetchWithTimeout(url, options = {}, ms = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/* =========================================================================
   REFERENCIAS DOM
   ========================================================================= */
const els = {
  menuBtn: $('#menuToggle'),
  mainNav: $('#mainNav'),
  themeToggle: $('#themeToggle'),
  year: $('#year'),

  searchInput: $('#search-input'),
  postsContainer: $('#posts-container'),
  btnMore: $('#btn-load-more'),
  btnLess: $('#btn-load-less'),
  resultsCounter: $('#results-counter'),
  emptyState: $('#empty-state'),
  clearFiltersBtn: $('#clear-filters-btn')
};

// Año dinámico en footer
if (els.year) els.year.textContent = new Date().getFullYear();

/* =========================================================================
   MENÚ MÓVIL ACCESIBLE
   ========================================================================= */
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

/* =========================================================================
   TEMA CLARO/OSCURO
   ========================================================================= */
(function initTheme() {
  const { themeToggle } = els;
  const root = document.documentElement;
  const STORAGE_KEY = 'blog-theme';

  const apply = (mode) => {
    root.classList.toggle('theme--dark', mode === 'dark');
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(mode === 'dark'));
      themeToggle.textContent = mode === 'dark' ? '🌞' : '🌙';
    }
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  let mode = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(mode);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, mode);
      apply(mode);
    });
  }
})();

/* =========================================================================
   ESTADO DE POSTS
   ========================================================================= */
const STATE = {
  all: /** @type {Array<{id:number,title:string,date:string,author:string,summary:string,link:string}>} */([]),
  filtered: [],
  visibleCount: 4,
  step: 4
};

/* =========================================================================
   RENDER
   ========================================================================= */
const renderCard = (post) => {
  const a11yDate = post.date;
  const humanDate = formatDate(post.date);
  return `
    <article class="card">
      <header class="card__header">
        <h2 class="card__title"><a href="${post.link}">${post.title}</a></h2>
        <p class="card__meta"><time datetime="${a11yDate}">${humanDate}</time> · ${post.author}</p>
      </header>
      <p class="card__excerpt">${post.summary}</p>
      <p class="card__actions">
        <a class="btn btn--link" href="${post.link}" aria-label="Leer más: ${post.title}">Leer más →</a>
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

const render = () => {
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
};

/* =========================================================================
   FILTRO EN TIEMPO REAL
   ========================================================================= */
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

/* =========================================================================
   EVENTOS UI
   ========================================================================= */
const bindUI = () => {
  if (els.searchInput) {
    els.searchInput.addEventListener('input', (e) => {
      applySearch(e.target.value);
    });
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
      applySearch('');
    });
  }
};

/* =========================================================================
   SWITCH DE FUENTE (JSON ↔ PHP)
   ========================================================================= */
/**
 * Detecta si hay backend disponible en ./Backend/api/env.php
 * y retorna la URL de datos adecuada.
 * - Live Server (sin PHP): usa ./assets/data/posts.json
 * - Localhost con PHP: si env.php responde {"APP_ENV":"php"} → usa ./Backend/api/posts.php
 */
async function getPostsEndpoint() {
  // 1) Intentar backend (misma raíz, carpeta "Backend")
  try {
    const r = await fetchWithTimeout('./backend/api/env.php');
    if (r.ok) {
      const j = await r.json().catch(() => ({}));
      if (String(j?.APP_ENV || '').toLowerCase() === 'php') {
        return './backend/api/posts.php';
      }
    }
  } catch { /* sin backend, seguimos */ }

  // 2) Fallback a JSON estático
  return './assets/data/posts.json';
}

/* =========================================================================
   CARGA DE DATOS
   ========================================================================= */
/**
 * Carga posts desde la URL indicada y pinta la lista.
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
      link: String(p.link || '#')
    }));

    // ordenar por fecha desc
    STATE.all.sort((a, b) => new Date(b.date) - new Date(a.date));

    // estado inicial
    STATE.filtered = STATE.all.slice();
    STATE.visibleCount = Math.min(STATE.step, STATE.filtered.length || STATE.step);

    bindUI();
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

/* =========================================================================
   INICIO
   ========================================================================= */
document.addEventListener('DOMContentLoaded', async () => {
  const DATA_URL = await getPostsEndpoint();
  await loadPosts(DATA_URL);
});
