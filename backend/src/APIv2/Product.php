<?php

namespace src\APIv2;

/**
 * Base class for Products
 */
class Product extends Model
{
    //
    // Schema
    //

    protected $sku;
    protected $name;
    protected $price;
    protected $type;

    protected function numericAttributes()
    {
        return array_merge(
            parent::numericAttributes(),
            ["price"]
        );
    }

    protected function attributeOrder()
    {
        return array_merge(
            parent::attributeOrder(),
            ["sku", "name", "price", "type"]
        );
    }

    //
    // Constructors
    //

    /**
     * Configure database adapter
     */
    protected static function getDBAdapter()
    {
        return new DBAdapter("products");
    }

    /**
     * Internal constructor
     */
    public function __construct(array $attributes)
    {
        $this->setSKU($attributes["sku"]);
        $this->setName($attributes["name"]);
        $this->setPrice($attributes["price"]);
        $this->setType($attributes["type"]);
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
     * For loading Product(s) from database
     * @param array $state Array of [$field => $value, ...] pairs
     * @return Product
     */
    protected static function load(array $state)
    {
        $product = static::create($state);
        $product->id = $state["id"];
        return $product;
    }

    /**
     * Search Products table
     * @param array $clause Array of [$field => $value, ...] pairs
     * @param int $limit Limit search results. No limit by default
     * @param bool $desc List rows in reverse order
     * @return Product[]|false
     */
    public static function find(array $clause, int $limit = null, $desc = false)
    {
        $adapter = static::getDBAdapter();
        $result = $adapter->select($clause, $limit, $desc);
        if (!$result) return $result;
        $data = array_map(function ($p) {
            return static::load($p);
        }, $result);
        return $data;
    }

    /**
     * List all Products
     * @return Product[]|false
     */
    public static function getAll()
    {
        return static::find([]);
    }

    /**
     * Get Product by id
     * @param int $id
     * @return Product|false
     */
    public static function getById(int $id)
    {
        $result = static::find(["id" => $id]);
        if (!$result) return $result;
        return $result[0];
    }

    //
    // Getters and setters
    //

    public function __get($name)
    {
        return $this->$name;
    }

    protected function setSKU($sku)
    {
        $this->sku = static::getSanitizedString($sku);
    }

    public function setName($name)
    {
        $this->name = static::getSanitizedString($name);
    }

    public function setPrice($price)
    {
        $this->price = static::getSanitizedNumber($price);
    }

    protected function setType($type)
    {
        $this->type = static::getSanitizedString($type);
    }

    //
    // Data operations
    //

    public function validate()
    {
        $errors = [];

        // Check if all fields are present
        // Fields should be already sanitized through setters
        $props = $this->toDataArray();
        $numeric = $this->numericAttributes();
        foreach ($props as $key => $val) {
            if (isset($val)) continue;
            $type = in_array($key, $numeric) ? "number" : "string";
            $errors[$key] = "Field '$key' of type '$type' is required.";
        }

        // Check if product's SKU is unique on creation
        if (!isset($this->id) && isset($this->sku)) {
            $inDB = self::find(["sku" => $this->sku]);
            if (!empty($inDB)) $errors["sku"] = "Product's SKU must be unique: " .
                "'$this->sku' is already in the databse";
        }

        return !empty($errors) ? $errors : null;
    }

    /**
     * @throws ValidationError
     */
    public function save()
    {
        $errors = $this->validate();
        if (!empty($errors)) throw new ValidationError($errors);

        $adapter = static::getDBAdapter();
        $data = $this->toDataArray();
        if (isset($this->id)) {
            $adapter->update($this->id, $data);
        } else {
            $id = $adapter->insert($data);
            $this->id = $id;
        }
    }

    public function delete()
    {
        $adapter = static::getDBAdapter();
        $adapter->delete($this->id);
    }
}
