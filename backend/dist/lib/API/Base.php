<?php

namespace API;

require_once __DIR__ . "/" . "../Autoloader.php";
\Autoloader::register("../");

abstract class Base
{
  protected $methods = [];

  public function process_request()
  {
    $this->set_headers();
    try {
      $method = $this->get_request_method();
      $handler = "handle_" . $method;
      $this->$handler();
    } catch (\Throwable $err) {
      $this->respond($err->getMessage(), 500);
    }
  }

  protected function set_headers()
  {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: ' . join(", ", $this->methods));
    header('Access-Control-Allow-Headers: X-Requested-With');
    header('Content-Type: application/json');
  }

  protected function get_request_method()
  {
    $method = $_SERVER["REQUEST_METHOD"];
    if (!in_array($method, $this->methods)) {
      $this->respond_bad_request("Supported request methods: " . join(", ", $this->methods));
    }
    return $method;
  }

  protected function get_request_body()
  {
    try {
      return json_decode(file_get_contents('php://input'));
    } catch (\Throwable $th) {
      $this->respond_bad_request("Invalid JSON in request body.");
    }
  }

  protected function respond($data, $code = null)
  {
    if (isset($code)) http_response_code($code);
    echo json_encode($data);
    exit;
  }

  protected function respond_bad_request($data)
  {
    $this->respond($data, 400);
  }
}
