<?php

class Product
{
  private $id;
  private $sku;
  private $name;
  private $price;
  private $type;
  private $size;
  private $height;
  private $width;
  private $length;
  private $weight;

  function __construct($product)
  {
    $this->id = $product['id'];
    $this->sku = $product['sku'];
    $this->name = $product['name'];
    $this->price = $product['price'];
    $this->type = $product['type'];
    $this->size = $product['size'];
    $this->height = $product['height'];
    $this->width = $product['width'];
    $this->length = $product['length'];
    $this->weight = $product['weight'];
  }

  function getDetails()
  {
    switch ($this->type) {
      case "DVD":
        return "Size: $this->size MB";
        break;
      case "Furniture":
        return "Dimensions: {$this->height}x{$this->width}x{$this->length}";
        break;
      case "Book":
        return "Weight: $this->weight KG";
        break;
      default:
        return "";
    }
  }

  function getCheckbox()
  {
    return "<input class='delete-checkbox' type='checkbox' name='to_delete[]' value=$this->id />";
  }

  public function render()
  {
    $checkbox = $this->getCheckbox();
    $details = $this->getDetails();
    return ("
      <div class='product'>
        $checkbox
        <div>$this->sku</div>
        <div>$this->name</div>
        <div>$this->price</div>
        <div>$details</div>
      </div>
    ");
  }
}
