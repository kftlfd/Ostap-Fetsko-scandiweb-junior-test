<?php

namespace src\API;

abstract class Base
{
    protected $methods = [];

    public function processRequest()
    {
        $this->setHeaders();
        try {
            $method = $this->getRequestMethod();
            $handler = "handle" . $method;
            $this->$handler();
        } catch (\Throwable $err) {
            $this->respond($err->getMessage(), 500);
        }
    }

    protected function setHeaders()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: ' . join(", ", $this->methods));
        header('Access-Control-Allow-Headers: X-Requested-With');
        header('Content-Type: application/json');
    }

    protected function getRequestMethod()
    {
        $method = $_SERVER["REQUEST_METHOD"];
        if (!in_array($method, $this->methods)) {
            $this->respondBadRequest("Supported request methods: " .
                join(", ", $this->methods));
        }
        return $method;
    }

    protected function getRequestBody()
    {
        try {
            return json_decode(file_get_contents('php://input'));
        } catch (\Throwable $th) {
            $this->respondBadRequest("Invalid JSON in request body.");
        }
    }

    protected function respond($data, $code = null)
    {
        if (isset($code)) http_response_code($code);
        echo json_encode($data);
        exit;
    }

    protected function respondBadRequest($data)
    {
        $this->respond($data, 400);
    }
}
