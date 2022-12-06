<?php

namespace App\Category;

use App\Product;

/**
 * DVD category class
 * @property int|float $size
 */
class DVD extends Product
{
    protected const F_SIZE = "size";

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setSize(static::array_get($attributes, self::F_SIZE));
    }

    public function setSize($size)
    {
        $this->setField(self::F_SIZE, $size, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
