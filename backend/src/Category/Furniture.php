<?php

namespace App\Category;

use App\Product;

/**
 * Furniture category class
 * @property int|float $height
 * @property int|float $width
 * @property int|float $length
 */
class Furniture extends Product
{
    protected const F_HEIGHT = "height";
    protected const F_WIDTH = "width";
    protected const F_LENGTH = "length";

    public function __construct(array $attributes)
    {
        parent::__construct($attributes);
        $this->setHeight(static::array_get($attributes, self::F_HEIGHT));
        $this->setWidth(static::array_get($attributes, self::F_WIDTH));
        $this->setLength(static::array_get($attributes, self::F_LENGTH));
    }

    public function setHeight($height)
    {
        $this->setField(self::F_HEIGHT, $height, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }

    public function setWidth($width)
    {
        $this->setField(self::F_WIDTH, $width, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }

    public function setLength($length)
    {
        $this->setField(self::F_LENGTH, $length, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }
}
