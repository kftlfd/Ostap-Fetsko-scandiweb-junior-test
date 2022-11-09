<?php

namespace DB;

class Products extends Table
{
  protected $table = "products";

  protected $schema = [
    "id" => ["types" => ["integer"]],
    "sku" => ["types" => ["string"], "required" => true],
    "name" => ["types" => ["string"], "required" => true],
    "price" => ["types" => ["integer", "double"], "required" => true],
    "type" => ["types" => ["string"], "values" => ["DVD", "Furniture", "Book"], "required" => true],
    "size" => ["types" => ["integer", "double"]],
    "width" => ["types" => ["integer", "double"]],
    "height" => ["types" => ["integer", "double"]],
    "length" => ["types" => ["integer", "double"]],
    "weight" => ["types" => ["integer", "double"]]
  ];

  private $basic_fields = ["id", "sku", "name", "price", "type"];

  private $fields_by_category = [
    "DVD" => ["size"],
    "Furniture" => ["width", "height", "length"],
    "Book" => ["weight"]
  ];

  private function prune_product($product)
  {
    foreach (array_keys($product) as $key) {
      if (
        !in_array($key, $this->fields_by_category[$product["type"]]) &&
        !in_array($key, $this->basic_fields)
      ) {
        unset($product[$key]);
      }
    }
    return $product;
  }

  public function list_all()
  {
    $products = $this->select_all();
    $products = array_map(array($this, "prune_product"), $products);
    return $products;
  }

  public function get_by_id($id)
  {
    $product = $this->select_where("id", $id)[0];
    return $this->prune_product($product);
  }

  private function validate_sku($product_map)
  {
    $sku = $product_map["sku"];
    if (!isset($sku) || empty($sku)) {
      return "Product must have a 'sku'";
    }

    $in_db = $this->select_where("sku", $sku);
    if (!empty($in_db)) {
      return "Product SKU must be unique, SKU '$sku' is already in database";
    }
  }

  private function validate_category_fields($product_map)
  {
    $type = $product_map["type"];
    if (!isset($type)) {
      return "Product must have a 'type'";
    }

    $categories = array_keys($this->fields_by_category);
    if (!in_array($type, $categories)) {
      return "Supported product types: " . join(", ", $categories);
    }

    $product_keys = array_keys($product_map);
    foreach ($this->fields_by_category[$type] as $field) {
      if (!in_array($field, $product_keys)) {
        return "Product of type '$type' must have these fields: " .
          join(", ", $this->fields_by_category[$type]);
      }
    }
  }

  public function add_product($product_map)
  {
    $invalid_sku = $this->validate_sku($product_map);
    if (isset($invalid_sku)) return ["sku" => $invalid_sku];

    $invalid_category = $this->validate_category_fields($product_map);
    if (isset($invalid_category)) return ["type" => $invalid_category];

    $result = $this->create($product_map);

    if (is_array($result)) {
      // got validation errors
      return $result;
    } else if (is_bool($result)) {
      // failed to insert
      return;
    } else {
      // successful insertion, got row id
      return $result;
    }
  }
}
