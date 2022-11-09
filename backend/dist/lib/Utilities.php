<?php

class Utilities
{
  static function insert_separators($array, string $sep)
  {
    $len = count($array) - 1;
    for ($i = 0; $i < $len; $i++) {
      $array[$i] = $array[$i] . $sep;
    }
    return $array;
  }

  static function insert_commas($array)
  {
    return self::insert_separators($array, ", ");
  }

  static function prepend_colon($str)
  {
    return ":" . $str;
  }
}
