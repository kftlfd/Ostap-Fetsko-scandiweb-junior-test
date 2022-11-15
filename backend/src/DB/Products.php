<?php

namespace src\DB;

use src\DB\ValidationError;

class Products extends Table
{
    protected $table = "products";

    protected $schema = [
        "id" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC],
        "sku" => [self::SCHEMA_TYPE => self::TYPE_STRING, self::SCHEMA_REQUIRED => true],
        "name" => [self::SCHEMA_TYPE => self::TYPE_STRING, self::SCHEMA_REQUIRED => true],
        "price" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC, self::SCHEMA_REQUIRED => true],
        "type" => [
            self::SCHEMA_REQUIRED => true,
            self::SCHEMA_TYPE => self::TYPE_STRING,
            self::SCHEMA_VALUES => ["DVD", "Furniture", "Book"]
        ],
        "size" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC],
        "width" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC],
        "height" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC],
        "length" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC],
        "weight" => [self::SCHEMA_TYPE => self::TYPE_NUMERIC]
    ];

    protected $fieldsBasic = ["id", "sku", "name", "price", "type"];

    protected $fieldsByCategory = [
        "DVD" => ["size"],
        "Furniture" => ["width", "height", "length"],
        "Book" => ["weight"]
    ];

    //
    // Data operations
    //

    public function getById($id)
    {
        $product = $this->selectWhere("id", $id)[0];
        return $this->pruneProduct($product);
    }

    public function listAll()
    {
        $products = $this->selectAll();
        $products = array_map(array($this, "pruneProduct"), $products);
        return $products;
    }

    public function create($productMap)
    {
        if (!is_object($productMap)) {
            throw new ValidationError(["error" => "Request body must be a valid JSON object."]);
        }

        $productMap = get_object_vars($productMap);
        $this->validateSKU($productMap);
        $this->validateCategoryFields($productMap);

        $newProductId = parent::create($productMap);
        $newProduct = $this->getById($newProductId);
        return $newProduct;
    }

    //
    // Helpers
    //

    protected function pruneProduct($product)
    {
        foreach (array_keys($product) as $key) {
            if (
                !in_array($key, $this->fieldsByCategory[$product["type"]]) &&
                !in_array($key, $this->fieldsBasic)
            ) {
                unset($product[$key]);
            }
        }
        return $product;
    }

    public function toJSON($product)
    {
        $json = "{";
        foreach ($product as $key => $val) {
            $json .= "\"$key\"" . ":";
            $json .= $this->schema[$key]["type"] === "string" ? "\"$val\"" : $val;
            $json .= ",";
        }
        $json = rtrim($json, ",") . "}";
        return $json;
    }

    public function toJSONList($products)
    {
        $json = "[";
        foreach ($products as $product) {
            $json .= $this->toJSON($product) . ",";
        }
        $json = rtrim($json, ",") . "]";
        return $json;
    }

    protected function validateSKU($productMap)
    {
        $sku = $productMap["sku"];
        if (empty($sku)) {
            $this->validationErrors["sku"] = "Product must have a 'sku'";
            return;
        }

        $inDB = $this->selectWhere("sku", $sku);
        if (!empty($inDB)) {
            $this->validationErrors["sku"] = "Product SKU must be unique, SKU '$sku' is already in database";
        }
    }

    protected function validateCategoryFields($productMap)
    {
        $type = $productMap["type"];
        if (empty($type)) {
            $this->validationErrors["type"] = "Product must have a 'type'";
            return;
        }

        $categories = array_keys($this->fieldsByCategory);
        if (!in_array($type, $categories)) {
            $this->validationErrors["type"] = "Supported product types: " . join(", ", $categories);
            return;
        }

        $productKeys = array_keys($productMap);
        foreach ($this->fieldsByCategory[$type] as $field) {
            $fieldType = $this->schema[$field][self::SCHEMA_TYPE];
            $typeCheck = "is_" . $fieldType;
            if (!in_array($field, $productKeys)) {
                $this->validationErrors[$field] = "Field '$field' is required for type '$type'";
            } elseif (!$typeCheck($productMap[$field])) {
                $this->validationErrors[$field] = "Value for field '$field' should be of type '$fieldType'";
            }
        }
    }
}
