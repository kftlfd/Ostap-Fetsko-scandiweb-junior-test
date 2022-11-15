<?php

namespace src\API;

abstract class Base
{
    public const HTTP_201_CREATED = 201;
    public const HTTP_204_NO_DATA = 204;
    public const HTTP_400_BAD_REQUEST = 400;
    public const HTTP_405_METHOD_NOT_ALLOWED = 405;
    public const HTTP_500_INTERNAL_SERVER_ERROR = 500;

    protected $methods = [];

    public function processRequest()
    {
        $this->setHeaders();
        $method = $this->getRequestMethod();
        $handler = "handle" . $method;
        try {
            $this->setup();
            $this->$handler();
        } catch (\Throwable $err) {
            $this->respond(
                $err->getMessage(),
                self::HTTP_500_INTERNAL_SERVER_ERROR,
                true
            );
        }
    }

    protected abstract function setup();

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
            $this->respond(
                "Supported request methods: " . join(", ", $this->methods),
                self::HTTP_405_METHOD_NOT_ALLOWED,
                true
            );
        }
        return $method;
    }

    protected function getRequestBodyJSON()
    {
        return json_decode(file_get_contents('php://input'));
    }

    protected function respond($data, $code = null, $encode = false)
    {
        if (isset($code)) http_response_code($code);
        if (!isset($data)) exit;
        if ($encode) $data = json_encode($data, JSON_NUMERIC_CHECK);
        echo $data;
        exit;
    }
}
