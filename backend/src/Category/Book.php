<?php

namespace App\Category;

use App\Product;

/**
 * Book category class
 * @property int|float $weight
 */
class Book extends Product
{
    protected const F_WEIGHT = "weight";

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setWeight(static::array_get($attributes, self::F_WEIGHT));
    }

    public function setWeight($weight)
    {
        $this->setField(self::F_WEIGHT, $weight, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
