<?php
require_once __DIR__ . '/config.php';

/**
 * Retorna una conexión PDO lista para usar.
 * @return PDO
 */
function db(): PDO {
  static $pdo = null;
  if ($pdo instanceof PDO) return $pdo;

  $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s',
    DB_HOST, DB_PORT, DB_NAME, DB_CHARSET
  );

  $options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
  ];

  $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
  return $pdo;
}
