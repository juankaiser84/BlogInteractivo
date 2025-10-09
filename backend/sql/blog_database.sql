CREATE DATABASE IF NOT EXISTS blog_interactivo
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_interactivo;

CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug  VARCHAR(180) NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content MEDIUMTEXT NULL,
  author VARCHAR(120) NOT NULL DEFAULT 'Juan Kaiser',
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Semillas rápidas (coinciden con tu JSON)
INSERT INTO posts (title, slug, summary, author, date) VALUES
('Carga dinámica desde JSON','carga-dinamica-desde-json','Cómo mostrar posts dinámicamente en HTML leyendo un archivo JSON.','Juan Kaiser','2025-10-04'),
('Tema claro y oscuro con toggle','tema-claro-y-oscuro-con-toggle','Activando un modo oscuro y claro con CSS Variables y localStorage.','Juan Kaiser','2025-10-03'),
('Menú hamburguesa responsive','menu-hamburguesa-responsive','Cómo implementar un menú adaptable en móviles y escritorio con JavaScript.','Juan Kaiser','2025-10-02'),
('CSS Variables y temas','css-variables-y-temas','Usando variables de CSS para crear temas dinámicos y consistentes.','Juan Kaiser','2025-10-01'),
('Aprendiendo HTML semántico','aprendiendo-html-semantico','Cómo usar etiquetas semánticas para mejorar accesibilidad y SEO.','Juan Kaiser','2025-09-30'),
('Primer post de ejemplo','primer-post-de-ejemplo','Este es un post de prueba para el Blog Interactivo.','Juan Kaiser','2025-09-29');
