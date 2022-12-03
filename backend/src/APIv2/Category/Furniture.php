<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

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
        $this->setField("height", $height, true);
    }

    public function setWidth($width)
    {
        $this->setField("width", $width, true);
    }

    public function setLength($length)
    {
        $this->setField("length", $length, true);
    }
}
