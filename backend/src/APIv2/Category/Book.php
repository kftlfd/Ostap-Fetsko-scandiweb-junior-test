<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

/**
 * Book category class
 * @property int|float $weight
 */
class Book extends Product
{
    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setWeight($attributes["weight"]);
    }

    public function setWeight($weight)
    {
        $this->setField("weight", $weight, true);
    }
}
