<?php

require './db.php';
require './respond.php';

$db = get_db();
$data = $db->query("SELECT * FROM products")->fetchAll();
respond($data);
