<?php

namespace src\APIv2;

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
        $this->setId(null);
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
        $product->setField("id", $state["id"], true);
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
    // Setters
    //

    protected function setId($id)
    {
        $this->setField("id", $id, true);
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

    //
    // Data operations
    //

    public function validate()
    {
        $errors = [];

        // Check if all fields are present
        // Fields should be already sanitized through setters
        $data = $this->toDataArray();
        foreach ($data as $key => $val) {
            if (isset($val)) continue;
            $errors[$key] = "Field '$key' of type '{$this->data[$key][self::FIELD_TYPE]}' is required.";
        }

        // Check if product's SKU is unique on creation
        if (!isset($this->id)) {
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
            $this->setId($id);
        }
    }

    public function delete()
    {
        $adapter = static::getDBAdapter();
        $adapter->delete($this->id);
    }
}
