<?php

require '../lib/db.php';
require '../lib/respond.php';

$db = get_db();
$data = $db->query("SELECT * FROM products")->fetchAll();
respond($data);
