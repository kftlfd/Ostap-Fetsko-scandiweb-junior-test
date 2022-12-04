<?php

namespace App\Category;

use App\Product;

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
        $this->setField("weight", $weight, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
