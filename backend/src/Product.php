<?php

namespace App;

/**
 * Base class for Products
 * @property int $id
 * @property string $sku
 * @property string $name
 * @property int|float $price
 * @property string $type
 */
class Product extends Model
{
    protected const TABLE = "products";
    protected const F_SKU = "sku";
    protected const F_NAME = "name";
    protected const F_PRICE = "price";
    protected const F_TYPE = "type";

    protected function __construct(array $attributes)
    {
        $this->setId();
        $this->setSKU(static::array_get($attributes, self::F_SKU));
        $this->setName(static::array_get($attributes, self::F_NAME));
        $this->setPrice(static::array_get($attributes, self::F_PRICE));
        $this->setType(static::array_get($attributes, self::F_TYPE));
    }

    protected function setSKU($sku)
    {
        $this->setField(self::F_SKU, $sku, [
            self::FIELD_MAX_LEN => 100
        ]);
    }

    public function setName($name)
    {
        $this->setField(self::F_NAME, $name, [
            self::FIELD_MAX_LEN => 250
        ]);
    }

    public function setPrice($price)
    {
        $this->setField(self::F_PRICE, $price, [
            self::FIELD_TYPE => self::TYPE_NUMBER,
            self::FIELD_MAX => 10 ** 8
        ]);
    }

    protected function setType($type)
    {
        $this->setField(self::F_TYPE, $type, [
            self::FIELD_MAX_LEN => 30
        ]);
    }

    /**
     * Public constuctor. Returns instanse of Product or some Category subclass
     * @param array $attributes Array of [$field => $value, ...] pairs
     * @throws ValidationError if attempting to create product of non-supported subclass
     * @return Product
     */
    public static function create(array $attributes)
    {
        $category = static::array_get($attributes, self::F_TYPE);
        $categoryClass = __NAMESPACE__ . "\\Category\\" . $category;
        if (
            !class_exists($categoryClass) ||
            !is_subclass_of($categoryClass, __CLASS__)
        ) {
            // Fallback to base Product class (if disabling error)
            $categoryClass = __CLASS__;
            throw new ValidationError(["type" => "Category '$category' is not supported."]);
        }
        return new $categoryClass($attributes);
    }

    /**
     * Overload load() method to use `static::create()` constructor
     * @param array $state Array of [$field => $value, ...] pairs
     * @return Product
     */
    protected static function load(array $state)
    {
        $product = static::create($state);
        $product->setId($state[self::ID_FIELD]);
        return $product;
    }

    public function validate()
    {
        $errors = parent::validate();

        // Check if product's SKU is unique on creation
        if (isset($this->sku) && !isset($this->id)) {
            $inDB = static::find(["sku" => $this->sku]);
            if (!empty($inDB)) $errors["sku"] = "SKU '$this->sku' is already in the database.";
        }

        return !empty($errors) ? $errors : null;
    }
}
