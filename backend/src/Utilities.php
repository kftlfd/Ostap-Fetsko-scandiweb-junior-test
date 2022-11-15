<?php

namespace src;

class Utilities
{
    public static function insert_separators($array, string $sep)
    {
        $len = count($array) - 1;
        for ($i = 0; $i < $len; $i++) {
            $array[$i] = $array[$i] . $sep;
        }
        return $array;
    }

    public static function insert_commas($array)
    {
        return self::insert_separators($array, ", ");
    }

    public static function prepend_colon($str)
    {
        return ":" . $str;
    }

    public static function isIntegerArray(&$arr)
    {
        foreach ($arr as $val) {
            if (!is_int($val)) return false;
        }
        return true;
    }
}
