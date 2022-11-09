<?php
require "../lib/Autoloader.php";
Autoloader::register("../lib/");
$api = new API\API();
$api->process_request();
