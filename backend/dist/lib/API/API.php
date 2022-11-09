<?php

namespace API;

class API extends Base
{
  protected $methods = ["OPTIONS", "GET", "POST", "DELETE"];

  function __construct()
  {
    $this->db = new \DB\Products();
  }

  public function handle_OPTIONS()
  {
    $this->respond([
      "OPTIONS" => "Get list of supported request methods and expected inputs.",
      "GET" => "Get all products. No input.",
      "POST" => [
        "description" => "Create new product.",
        "input object" => [
          "sku" => "string",
          "name" => "string",
          "price" => "integer | float (double)",
          "type" => "string (depending on type (category), additional fields may be required)"
        ]
      ],
      "DELETE" => "Delete ids from database. Input: array of integers (product ids)."
    ]);
  }

  public function handle_GET()
  {
    $this->respond($this->db->list_all());
  }

  public function handle_POST()
  {
    $product_map = $this->get_request_body();
    if (!is_object($product_map)) $this->respond_bad_request("Input must be an object.");

    $product_map = get_object_vars($product_map);
    if (empty($product_map)) $this->respond_bad_request("Input is empty.");

    $created = $this->db->add_product($product_map);
    if (!isset($created)) {
      $this->respond("Failed to insert new product", 500);
    } else if (is_array($created)) {
      // validation errors
      $this->respond_bad_request($created);
    }

    $this->respond($this->db->get_by_id($created));
  }

  public function handle_DELETE()
  {
    $ids = $this->get_request_body();
    if (!is_array($ids) || empty($ids) || !$this->is_integer_array($ids)) {
      $this->respond_bad_request("Array of integers (product ids) is expected");
    }
    $this->db->delete_ids($ids);
    $this->respond(null, 201);
  }

  private function is_integer_array($arr)
  {
    foreach ($arr as $val) {
      if (!is_int($val)) return false;
    }
    return true;
  }
}
