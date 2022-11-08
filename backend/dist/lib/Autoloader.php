<?php

class Autoloader
{
  static function register($base_path = "")
  {
    spl_autoload_register(function ($class_name) {
      require $base_path . str_replace('\\', DIRECTORY_SEPARATOR, $class_name) . '.php';
    });
  }
}
