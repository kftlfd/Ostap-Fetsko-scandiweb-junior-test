<?php

require './db.php';
require './respond.php';

$db = get_db();

if ($_SERVER['REQUEST_METHOD'] !== "POST") {
  respond('Request method must be POST', 400);
}

$product = json_decode(file_get_contents('php://input'));
$errors = [];

if (empty($product->sku)) {
  $errors["sku"] = "SKU required";
}

$inDB = $db->query("SELECT * FROM products WHERE sku = '$product->sku'")->fetchAll();
if (array_filter($inDB)) {
  respond(['sku' => 'Provided SKU is already used in DB'], 400);
}

if (empty($product->name)) {
  $errors["name"] = "Name required";
}

if (empty($product->price)) {
  $errors["price"] = "Price required";
}

$types = ['DVD', 'Furniture', 'Book'];
if (empty($product->type)) {
  $errors["type"] = "Type required";
} elseif (!in_array($product->type, $types, true)) {
  $errors["type"] = "Type not recognized";
}

if (array_filter($errors)) {
  respond($errors, 400);
}

if ($product->type == "DVD") {
  if (empty($product->size)) {
    respond(['size' => "Size is required for type DVD"], 400);
  }
  $query = "INSERT INTO products (sku, name, price, type, size) VALUES (?,?,?,?,?)";
  $db->prepare($query)->execute([
    $product->sku,
    $product->name,
    $product->price,
    $product->type,
    $product->size
  ]);
}

if ($product->type == "Furniture") {
  if (empty($product->width) || empty($product->height) || empty($product->length)) {
    respond(['height' => "WxHxL dimensions are required for type Furniture"], 400);
  }
  $query = "INSERT INTO products (sku, name, price, type, width, height, length) VALUES(?,?,?,?,?,?,?)";
  $db->prepare($query)->execute([
    $product->sku,
    $product->name,
    $product->price,
    $product->type,
    $product->width,
    $product->height,
    $product->length,
  ]);
}

if ($product->type == "Book") {
  if (empty($product->weight)) {
    respond(['weight' => "Weight is required for type Book"], 400);
  }
  $query = "INSERT INTO products (sku, name, price, type, weight) VALUES (?,?,?,?,?)";
  $db->prepare($query)->execute([
    $product->sku,
    $product->name,
    $product->price,
    $product->type,
    $product->weight
  ]);
}

$created = $db->query("SELECT * FROM products WHERE sku = '$product->sku'")->fetchAll();

respond($created);
