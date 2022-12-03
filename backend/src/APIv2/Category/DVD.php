<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

/**
 * DVD category class
 * @property int|float $size
 */
class DVD extends Product
{
    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setSize($attributes["size"]);
    }

    public function setSize($size)
    {
        $this->setField("size", $size, true);
    }
}
