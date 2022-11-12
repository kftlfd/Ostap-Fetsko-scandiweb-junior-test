<?php

namespace src\API;

use src\DB\Products;

class API extends Base
{
    protected $methods = ["OPTIONS", "GET", "POST", "DELETE"];

    public function __construct()
    {
        $this->db = new Products();
    }

    protected function handleOPTIONS()
    {
        $this->respond([
            "OPTIONS" => "Get list of supported request methods and expected inputs.",
            "GET" => "Get all products. No input.",
            "POST" => [
                "description" => "Create new product.",
                "input object" => [
                    "sku" => "string",
                    "name" => "string",
                    "price" => "integer | float (double)",
                    "type" => "string (depending on type (category), additional fields may be required)"
                ]
            ],
            "DELETE" => "Delete ids from database. Input: array of integers (product ids)."
        ]);
    }

    protected function handleGET()
    {
        $this->respond($this->db->listAll());
    }

    protected function handlePOST()
    {
        $productMap = $this->getRequestBody();
        if (!is_object($productMap)) $this->respondBadRequest("Input must be an object.");

        $productMap = get_object_vars($productMap);
        if (empty($productMap)) $this->respondBadRequest("Input is empty.");

        $created = $this->db->addProduct($productMap);
        if (!isset($created)) {
            $this->respond("Failed to insert new product", 500);
        } else if (is_array($created)) {
            // validation errors
            $this->respondBadRequest($created);
        }

        $this->respond($this->db->getById($created));
    }

    protected function handleDELETE()
    {
        $ids = $this->getRequestBody();
        if (!is_array($ids) || empty($ids) || !$this->isIntegerArray($ids)) {
            $this->respondBadRequest("Array of integers (product ids) is expected");
        }
        $this->db->deleteIds($ids);
        $this->respond(null, 201);
    }

    private function isIntegerArray($arr)
    {
        foreach ($arr as $val) {
            if (!is_int($val)) return false;
        }
        return true;
    }
}
