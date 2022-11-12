<?php

namespace src\DB;

class Products extends Table
{
    protected $table = "products";

    protected $schema = [
        "id" => ["types" => ["integer"]],
        "sku" => ["types" => ["string"], "required" => true],
        "name" => ["types" => ["string"], "required" => true],
        "price" => ["types" => ["integer", "double"], "required" => true],
        "type" => [
            "required" => true,
            "types" => ["string"],
            "values" => ["DVD", "Furniture", "Book"]
        ],
        "size" => ["types" => ["integer", "double"]],
        "width" => ["types" => ["integer", "double"]],
        "height" => ["types" => ["integer", "double"]],
        "length" => ["types" => ["integer", "double"]],
        "weight" => ["types" => ["integer", "double"]]
    ];

    protected $basicFields = ["id", "sku", "name", "price", "type"];

    protected $fieldsByCategory = [
        "DVD" => ["size"],
        "Furniture" => ["width", "height", "length"],
        "Book" => ["weight"]
    ];

    protected function pruneProduct($product)
    {
        foreach (array_keys($product) as $key) {
            if (
                !in_array($key, $this->fieldsByCategory[$product["type"]]) &&
                !in_array($key, $this->basicFields)
            ) {
                unset($product[$key]);
            }
        }
        return $product;
    }

    public function listAll()
    {
        $products = $this->selectAll();
        $products = array_map(array($this, "pruneProduct"), $products);
        return $products;
    }

    public function getById($id)
    {
        $product = $this->selectWhere("id", $id)[0];
        return $this->pruneProduct($product);
    }

    protected function validateSKU($productMap)
    {
        $sku = $productMap["sku"];
        if (!isset($sku) || empty($sku)) {
            return "Product must have a 'sku'";
        }

        $inDB = $this->selectWhere("sku", $sku);
        if (!empty($inDB)) {
            return "Product SKU must be unique, SKU '$sku' is already in database";
        }
    }

    protected function validateCategoryFields($productMap)
    {
        $type = $productMap["type"];
        if (!isset($type)) {
            return "Product must have a 'type'";
        }

        $categories = array_keys($this->fieldsByCategory);
        if (!in_array($type, $categories)) {
            return "Supported product types: " . join(", ", $categories);
        }

        $productKeys = array_keys($productMap);
        foreach ($this->fieldsByCategory[$type] as $field) {
            if (!in_array($field, $productKeys)) {
                return "Product of type '$type' must have these fields: " .
                    join(", ", $this->fieldsByCategory[$type]);
            }
        }
    }

    public function addProduct($productMap)
    {
        $invalidSKU = $this->validateSKU($productMap);
        if (isset($invalidSKU)) return ["sku" => $invalidSKU];

        $invalidCategory = $this->validateCategoryFields($productMap);
        if (isset($invalidCategory)) return ["type" => $invalidCategory];

        $result = $this->create($productMap);

        if (is_array($result)) {
            // got validation errors
            return $result;
        } else if (is_bool($result)) {
            // failed to insert
            return;
        } else {
            // successful insertion, got row id
            return $result;
        }
    }
}
