"use strict";

/**
 * Alterna el menú hamburguesa en móviles
 */
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("nav ul");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});
/**
 * Toggle de tema claro/oscuro con localStorage
 */
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;

  // Revisar si hay preferencia guardada
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-theme");
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");

    // Guardar preferencia
    if (body.classList.contains("dark-theme")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
});
/**
 * Marca automáticamente el enlace activo en el menú
 */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
});
/**
 * Cierra el menú móvil al hacer clic en un enlace
 */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    const navMenu = document.querySelector("nav ul");
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
    }
  });
});

/**
 * Cargar posts desde JSON y renderizarlos en index.html
 */
document.addEventListener("DOMContentLoaded", () => {
  const postsSection = document.querySelector("section");

  if (postsSection) {
    fetch("assets/data/posts.json")
      .then(response => response.json())
      .then(data => {
        renderPosts(data, postsSection);
      })
      .catch(error => {
        console.error("Error cargando posts:", error);
        postsSection.innerHTML += "<p>No se pudieron cargar los posts.</p>";
      });
  }
});

/**
 * Renderiza posts dentro de una sección
 * @param {Array} posts - Lista de posts
 * @param {HTMLElement} container - Sección donde se mostrarán
 */
function renderPosts(posts, container) {
  posts.forEach(post => {
    const article = document.createElement("article");
    article.innerHTML = `
      <header>
        <h3>${post.title}</h3>
        <p><time datetime="${post.date}">${new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</time> · ${post.author}</p>
      </header>
      <p>${post.summary}</p>
      <footer>
        <a href="${post.link}">Leer más →</a>
      </footer>
    `;
    container.appendChild(article);
  });
}

"use strict";

let allPosts = [];      // Guardar todos los posts cargados
let postsPerPage = 3;   // Cantidad a mostrar por página
let currentPage = 1;    // Página actual

document.addEventListener("DOMContentLoaded", () => {
  const postsSection = document.querySelector("section");
  const searchInput = document.querySelector("#search");
  const loadMoreBtn = document.querySelector("#load-more");

  if (postsSection) {
    fetch("assets/data/posts.json")
      .then(response => response.json())
      .then(data => {
        allPosts = data;
        renderPosts(getPaginatedPosts(), postsSection);
        toggleLoadMore(); // Mostrar u ocultar el botón según queden posts
      })
      .catch(error => {
        console.error("Error cargando posts:", error);
        postsSection.innerHTML += "<p>No se pudieron cargar los posts.</p>";
      });
  }

  // 🔎 Filtrado en tiempo real
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      const term = e.target.value.toLowerCase();
      const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.summary.toLowerCase().includes(term)
      );

      currentPage = 1;
      postsSection.innerHTML = "<h2 id='titulo-posts'>Últimos Posts</h2>";
      renderPosts(getPaginatedPosts(filtered), postsSection);
      toggleLoadMore(filtered);
    });
  }

  // 📄 Botón "Cargar más"
  // 📄 Botón "Cargar más"
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    renderPosts(getPaginatedPosts(), postsSection);
    toggleLoadMore();
  });
}
});

/**
 * Renderiza posts dentro de una sección
 */
/**
 * Renderiza posts dentro de una sección
 */
function renderPosts(posts, container) {
  container.innerHTML = "<h2 id='titulo-posts'>Últimos Posts</h2>"; // Reinicia el contenido
  posts.forEach(post => {
    const article = document.createElement("article");
    article.innerHTML = `
      <header>
        <h3>${post.title}</h3>
        <p><time datetime="${post.date}">${new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</time> · ${post.author}</p>
      </header>
      <p>${post.summary}</p>
      <footer>
        <a href="${post.link}">Leer más →</a>
      </footer>
    `;
    container.appendChild(article);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const postsSection = document.querySelector("section");
  const searchInput = document.querySelector("#search");
  const loadMoreBtn = document.querySelector("#load-more");
  const loadLessBtn = document.querySelector("#load-less");

  if (postsSection) {
    fetch("assets/data/posts.json")
      .then(response => response.json())
      .then(data => {
        allPosts = data;
        renderPosts(getPaginatedPosts(), postsSection);
        toggleLoadButtons(); // Mostrar/ocultar botones
      })
      .catch(error => {
        console.error("Error cargando posts:", error);
        postsSection.innerHTML += "<p>No se pudieron cargar los posts.</p>";
      });
  }

  // 📄 Botón "Cargar más"
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      currentPage++;
      renderPosts(getPaginatedPosts(), postsSection);
      toggleLoadButtons();
    });
  }

  // 📄 Botón "Cargar menos"
  if (loadLessBtn) {
    loadLessBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPosts(getPaginatedPosts(), postsSection);
        toggleLoadButtons();
      }
    });
  }
});

/**
 * Mostrar/ocultar botones según la página
 */
function toggleLoadButtons(data = allPosts) {
  const loadMoreBtn = document.querySelector("#load-more");
  const loadLessBtn = document.querySelector("#load-less");

  // Botón "Cargar más"
  if (currentPage * postsPerPage >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }

  // Botón "Cargar menos"
  if (currentPage > 1) {
    loadLessBtn.style.display = "block";
  } else {
    loadLessBtn.style.display = "none";
  }
}


/**
 * Devuelve los posts correspondientes a la página actual
 */
function getPaginatedPosts(data = allPosts) {
  const end = currentPage * postsPerPage;
  return data.slice(0, end);
}

/**
 * Muestra u oculta el botón según queden posts
 */
function toggleLoadMore(data = allPosts) {
  const loadMoreBtn = document.querySelector("#load-more");
  if (currentPage * postsPerPage >= data.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
  }
}


