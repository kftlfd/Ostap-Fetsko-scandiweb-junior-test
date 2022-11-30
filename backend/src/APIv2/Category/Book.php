<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

/**
 * Book category class
 */
class Book extends Product
{
    protected $weight;

    protected function numericAttributes()
    {
        return array_merge(
            parent::numericAttributes(),
            ["weight"]
        );
    }

    protected function attributeOrder()
    {
        return array_merge(
            parent::attributeOrder(),
            ["weight"]
        );
    }

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setWeight($attributes["weight"]);
    }

    public function setWeight($weight)
    {
        $this->weight = static::getSanitizedNumber($weight);
    }
}
