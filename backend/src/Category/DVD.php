<?php

namespace App\Category;

use App\Product;

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
        $this->setField("size", $size, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
