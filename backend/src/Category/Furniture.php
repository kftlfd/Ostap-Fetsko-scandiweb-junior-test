<?php

namespace App\Category;

use App\Product;

/**
 * Furniture category class
 * @property int|float $height
 * @property int|float $width
 * @property int|float $length
 */
class Furniture extends Product
{
    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setHeight($attributes["height"]);
        $this->setWidth($attributes["width"]);
        $this->setLength($attributes["length"]);
    }

    public function setHeight($height)
    {
        $this->setField("height", $height, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }

    public function setWidth($width)
    {
        $this->setField("width", $width, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }

    public function setLength($length)
    {
        $this->setField("length", $length, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
