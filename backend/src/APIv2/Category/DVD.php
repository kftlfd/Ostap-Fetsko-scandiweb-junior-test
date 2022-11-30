<?php

namespace src\APIv2\Category;

use src\APIv2\Product;

/**
 * DVD category class
 */
class DVD extends Product
{
    protected $size;

    protected function numericAttributes()
    {
        return array_merge(
            parent::numericAttributes(),
            ["size"]
        );
    }

    protected function attributeOrder()
    {
        return array_merge(
            parent::attributeOrder(),
            ["size"]
        );
    }

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setSize($attributes["size"]);
    }

    public function setSize($size)
    {
        $this->size = static::getSanitizedNumber($size);
    }
}
