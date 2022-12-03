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

    protected function __construct(array $attributes)
    {
        $this->setId();
        $this->setSKU($attributes["sku"]);
        $this->setName($attributes["name"]);
        $this->setPrice($attributes["price"]);
        $this->setType($attributes["type"]);
    }

    protected function setSKU($sku)
    {
        $this->setField("sku", $sku);
    }

    public function setName($name)
    {
        $this->setField("name", $name);
    }

    public function setPrice($price)
    {
        $this->setField("price", $price, true);
    }

    protected function setType($type)
    {
        $this->setField("type", $type);
    }

    /**
     * Public constuctor. Returns instanse of Product or some Category subclass
     * @param array $attributes Array of [$field => $value, ...] pairs
     * @throws ValidationError if attempting to create product of non-supported subclass
     * @return Product
     */
    public static function create(array $attributes)
    {
        $category = $attributes["type"];
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
        $product->setId($state["id"]);
        return $product;
    }

    public function validate()
    {
        $errors = parent::validate();

        // Check if product's SKU is unique on creation
        if (!isset($this->id)) {
            $inDB = self::find(["sku" => $this->sku]);
            if (!empty($inDB)) $errors["sku"] = "Product's SKU must be unique: " .
                "'$this->sku' is already in the databse";
        }

        return !empty($errors) ? $errors : null;
    }
}
