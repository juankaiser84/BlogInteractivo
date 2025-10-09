<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';

try {
  $pdo = db();

  // Parámetros opcionales (no rompe compat con tu front actual)
  $q     = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
  $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 0; // 0 = sin límite
  $page  = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;

  $where = 'WHERE is_published = 1';
  $params = [];

  if ($q !== '') {
    $where .= ' AND (title LIKE :q OR summary LIKE :q)';
    $params[':q'] = "%{$q}%";
  }

  $order = 'ORDER BY date DESC, id DESC';
  $sql = "SELECT id, title, slug, summary, author, DATE_FORMAT(date, '%Y-%m-%d') AS date
          FROM posts
          {$where}
          {$order}";

  // Paginación opcional (tu front hoy no la usa)
  if ($limit > 0) {
    $offset = ($page - 1) * $limit;
    $sql .= " LIMIT :limit OFFSET :offset";
  }

  $stmt = $pdo->prepare($sql);

  // bind values
  foreach ($params as $k => $v) $stmt->bindValue($k, $v, PDO::PARAM_STR);
  if ($limit > 0) {
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', ($page - 1) * $limit, PDO::PARAM_INT);
  }

  $stmt->execute();
  $rows = $stmt->fetchAll();

  // Mapear al formato que ya espera tu front (incluye "link" como en posts.json)
  $posts = array_map(function(array $r){
    return [
      'id'      => (int)$r['id'],
      'title'   => $r['title'],
      'date'    => $r['date'],
      'author'  => $r['author'],
      'summary' => $r['summary'],
      'link'    => './posts/' . $r['slug'] . '.html',
    ];
  }, $rows);

  json_response($posts);
} catch (Throwable $e) {
  // Fallback: si falla DB, devolvemos el JSON del front (misma salida)
  try {
    $jsonPath = realpath(__DIR__ . '/../../assets/data/posts.json');
    if ($jsonPath === false || !is_readable($jsonPath)) {
      throw new RuntimeException('Fallback JSON no disponible');
    }
    $json = file_get_contents($jsonPath);
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
      throw new RuntimeException('Fallback JSON inválido');
    }
    // Orden por fecha desc por si acaso
    usort($data, function($a, $b){ return strcmp($b['date'] ?? '', $a['date'] ?? ''); });
    json_response($data);
  } catch (Throwable $fallbackError) {
    json_response([
      'error'  => 'No se pudo obtener la lista de posts.',
      'detail' => $e->getMessage(),
    ], 500);
  }
}
