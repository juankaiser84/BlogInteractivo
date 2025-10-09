<?php
// Indica al frontend que está en modo PHP (XAMPP)
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['APP_ENV' => 'php'], JSON_UNESCAPED_UNICODE);
