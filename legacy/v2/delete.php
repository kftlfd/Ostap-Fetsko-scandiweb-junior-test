<?php

require './db.php';
require './respond.php';

$db = get_db();

if ($_SERVER['REQUEST_METHOD'] !== "DELETE") {
  respond('Request method must be DELETE', 400);
}

$ids = json_decode(file_get_contents('php://input'));

$errors = [];

$query = $db->prepare("DELETE FROM products WHERE id=?");
$db->beginTransaction();
foreach ($ids as $id) {
  try {
    if (filter_var($id, FILTER_VALIDATE_INT) !== false) {
      $query->execute([$id]);
    }
  } catch (Exception $e) {
    array_push($errors, $e->getMessage());
  }
}
$db->commit();

respond($errors);
