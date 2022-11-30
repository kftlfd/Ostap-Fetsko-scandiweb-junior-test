<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

/**
 * Furniture category class
 */
class Furniture extends Product
{
    protected $height;
    protected $width;
    protected $length;

    protected function numericAttributes()
    {
        return array_merge(
            parent::numericAttributes(),
            ["height", "width", "length"]
        );
    }

    protected function attributeOrder()
    {
        return array_merge(
            parent::attributeOrder(),
            ["height", "width", "length"]
        );
    }

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setHeight($attributes["height"]);
        $this->setWidth($attributes["width"]);
        $this->setLength($attributes["length"]);
    }

    public function setHeight($height)
    {
        $this->height = static::getSanitizedNumber($height);
    }

    public function setWidth($width)
    {
        $this->width = static::getSanitizedNumber($width);
    }

    public function setLength($length)
    {
        $this->length = static::getSanitizedNumber($length);
    }
}
