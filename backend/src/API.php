<?php

namespace App;

/**
 * Handler for API requests
 */
class API extends APIBase
{
    protected $methods = ["OPTIONS", "GET", "POST", "PATCH", "DELETE"];

    /** Handler for requests with OPTIONS method */
    protected function handleOPTIONS()
    {
        $this->respond([
            "GET" => "Get list of all products",
            "POST" => "Create new product",
            "PATCH" => "Update product",
            "DELETE" => "Delete products"
        ], null, true);
    }

    /** Handler for requests with GET method */
    protected function handleGET()
    {
        $products = Product::getAll();

        $json = "[" . join(",", array_map(function (Product $p) {
            return $p->toJSON();
        }, $products)) . "]";

        $this->respond($json);
    }

    /** Handler for requests with POST method */
    protected function handlePOST()
    {
        // Hosting provider blocks DELETE request method, so redirecting them through POST
        if ($_SERVER["REQUEST_URI"] === "/api/delete/") {
            $this->handleDELETE();
            exit;
        }

        $input = $this->getInputObj();

        try {
            $newProduct = Product::create($input);
            $newProduct->save();
        } catch (ValidationError $err) {
            $this->respondBadRequest($err->getErrors());
        }
        $this->respond($newProduct->toJSON(), self::HTTP_201_CREATED);
    }

    /** Handler for requests with PUT method */
    protected function handlePATCH()
    {
        $input = $this->getInputObj();

        $id = $input["id"];
        if (!isset($id) or !is_int($id)) {
            $this->respondBadRequest("Product's ID of type 'int' is required.");
        }

        if (isset($input["type"]) || isset($input["sku"])) {
            $this->respondBadRequest("Changing product's type or SKU is currently not supported.");
        }

        $product = Product::getById($id);
        if (!$product) $this->respond("Product not found", self::HTTP_404_NOT_FOUND, true);

        unset($id);
        foreach ($input as $field => $val) {
            $updMethod = "set" . ucfirst($field);
            if (!method_exists($product, $updMethod)) continue;
            $product->$updMethod($val);
        }
        try {
            $product->save();
        } catch (ValidationError $err) {
            $this->respondBadRequest($err->getErrors());
        }
        $this->respond($product->toJSON());
    }

    /** Handler for requests with DELETE method */
    protected function handleDELETE()
    {
        function array_every(array $arr, callable $cb)
        {
            foreach ($arr as $val) {
                if (!$cb($val)) return false;
            }
            return true;
        }

        $input = $this->getRequestBodyJSON();
        if (!is_array($input) || !array_every($input, "is_int")) {
            $this->respondBadRequest("Input must be an array of integers");
        }

        foreach ($input as $id) {
            $product = Product::getById($id);
            $product->delete();
        }
        $this->respond(null, self::HTTP_204_NO_DATA);
    }

    /** 
     * Get request body and check if it is a valid JSON object, respond with error message otherwise
     * @param bool $asArray Convert JSON object to array. True by default
     */
    protected function getInputObj($asArray = true)
    {
        $input = $this->getRequestBodyJSON();
        if (!is_object($input)) {
            $this->respondBadRequest("Input must be a valid JSON object");
        }
        if ($asArray) return get_object_vars($input);
        return $input;
    }
}
