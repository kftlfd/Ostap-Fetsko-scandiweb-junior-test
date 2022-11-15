<?php

namespace src\DB;

use Exception;

class ValidationError extends Exception
{
    public function __construct(
        $errors,
        $message = "Invalid data",
        $code = 0,
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
