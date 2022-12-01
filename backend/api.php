<?php

require __DIR__ . "/vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/config", "db.env");
$dotenv->load();

// $api = new src\APIv1\API();
$api = new src\APIv2\API();
$api->processRequest();
