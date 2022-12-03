<?php

namespace src\APIv2;

/**
 * Base class for API request handlers
 */
abstract class APIBase
{
    // HTTP response codes
    public const HTTP_201_CREATED = 201;
    public const HTTP_204_NO_DATA = 204;
    public const HTTP_400_BAD_REQUEST = 400;
    public const HTTP_404_NOT_FOUND = 404;
    public const HTTP_405_METHOD_NOT_ALLOWED = 405;
    public const HTTP_500_INTERNAL_SERVER_ERROR = 500;
    public const HTTP_501_NOT_IMPLEMENTED = 501;

    /** Supported request methods */
    protected $methods = [];

    /** Main class function, process http request */
    public function processRequest()
    {
        $this->setHeaders();
        $method = $this->getRequestMethod();
        $handler = "handle" . $method;
        if (!method_exists($this, $handler)) {
            $this->respond(null, self::HTTP_501_NOT_IMPLEMENTED);
        }
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

    /** Optional setup before invoking request handler */
    protected function setup()
    {
    }

    /** Set headers for response */
    protected function setHeaders()
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: ' . join(", ", $this->methods));
        header('Access-Control-Allow-Headers: X-Requested-With');
        header('Content-Type: application/json');
    }

    /** 
     * Returns request method, or responds with error message if method is not supported
     * @return string|void 
     */
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

    /** Returns request body trough json_decode */
    protected function getRequestBodyJSON()
    {
        return json_decode(file_get_contents('php://input'));
    }

    /** 
     * Respond to request and exit
     * @param mixed $data A valid JSON string, or other JSON-serializable data (but set $encode = true !)
     * @param int $code HTTP response code, by default 200 OK
     * @param bool $encode Encode $data with json_encode
     */
    protected function respond($data, $code = null, $encode = false)
    {
        if (isset($code)) http_response_code($code);
        if (!isset($data)) exit;
        if ($encode) $data = json_encode($data, JSON_NUMERIC_CHECK);
        echo $data;
        exit;
    }

    /**
     * Respond with HTTP 400 Bad Request
     * @param mixed $data A valid JSON string, or other JSON-serializable data (but set $encode = true !)
     * @param bool $encode Encode $data with json_encode
     */
    protected function respondBadRequest($data, $encode = true)
    {
        $this->respond(
            $data,
            self::HTTP_400_BAD_REQUEST,
            $encode
        );
    }
}
