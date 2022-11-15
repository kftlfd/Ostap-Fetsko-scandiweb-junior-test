<?php

namespace src\API;

use src\DB\Products;
use src\DB\ValidationError;

class API extends Base
{
    protected $methods = ["OPTIONS", "GET", "POST", "DELETE"];

    protected function setup()
    {
        $this->db = new Products();
    }

    protected function handleOPTIONS()
    {
        $this->respond([
            "GET" => "Get list of all products",
            "POST" => "Create new product",
            "DELETE" => "Delete products"
        ], null, true);
    }

    protected function handleGET()
    {
        $products = $this->db->listAll();
        $products = $this->db->toJSONList($products);
        $this->respond($products);
    }

    protected function handlePOST()
    {
        $product = $this->getRequestBodyJSON();
        try {
            $newProduct = $this->db->create($product);
            $newProduct = $this->db->toJSON($newProduct);
            $this->respond($newProduct, self::HTTP_201_CREATED);
        } catch (ValidationError $e) {
            $this->respond(
                $e->getErrors(),
                self::HTTP_400_BAD_REQUEST,
                true
            );
        }
    }

    protected function handleDELETE()
    {
        $ids = $this->getRequestBodyJSON();
        try {
            $this->db->deleteIds($ids);
            $this->respond(null, self::HTTP_204_NO_DATA);
        } catch (ValidationError $e) {
            $this->respond(
                $e->getErrors(),
                self::HTTP_400_BAD_REQUEST,
                true
            );
        }
    }
}
