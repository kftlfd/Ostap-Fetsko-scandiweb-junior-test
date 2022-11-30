<?php

namespace src\APIv2;

use Exception;

/**
 * Custom exception for Model validation errors
 */
class ValidationError extends Exception
{
    /** @var array */
    protected $errors;

    public function __construct(
        array $errors,
        string $message = "Invalid data",
        int $code = 0,
        \Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
