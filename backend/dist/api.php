<?php

use src\API\API;

spl_autoload_register(function ($className) {
    $file = str_replace("\\", DIRECTORY_SEPARATOR, $className) . ".php";
    if (file_exists($file)) require $file;
});

$api = new API();

$api->processRequest();
