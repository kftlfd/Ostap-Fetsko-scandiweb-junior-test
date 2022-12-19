<?php

require_once 'db.php';

// prepare variables
$types = ['DVD', 'Furniture', 'Book'];
$values = [];
$errors = [];

// process form submition
if ($_SERVER['REQUEST_METHOD'] === "POST") {

  // populate values

  $values['sku'] = $_POST['sku'];
  if (empty($_POST['sku'])) {
    $errors['sku'] = "SKU is required";
  }

  $values['name'] = $_POST['name'];
  if (empty($_POST['name'])) {
    $errors['name'] = "Name is required";
  }

  $values['price'] = $_POST['price'];
  if (empty($_POST['price'])) {
    $errors['price'] = "Price is required";
  }

  $values['type'] = $_POST['type'];
  if (empty($_POST['type'])) {
    $errors['type'] = "Type is required";
  } elseif (!in_array($_POST['type'], $types, true)) {
    $errors['type'] = "Type not recognized";
  }

  $values['size'] = $_POST['size'];
  if ($values['type'] === "DVD" && empty($_POST['size'])) {
    $errors['size'] = "Size is required";
  }

  $values['height'] = $_POST['height'];
  $values['width'] = $_POST['width'];
  $values['length'] = $_POST['length'];
  if ($values['type'] == "Furniture") {
    if (empty($_POST['height'])) {
      $errors['height'] = "height is required";
    }
    if (empty($_POST['width'])) {
      $errors['width'] = "width is required";
    }
    if (empty($_POST['length'])) {
      $errors['length'] = "length is required";
    }
  }

  $values['weight'] = $_POST['weight'];
  if ($values['type'] == "Book" && empty($_POST['weight'])) {
    $errors['weight'] = "weight is required";
  }

  // if no errors in form, make a query to db

  if (!array_filter(($errors))) {
    $query;
    $sku = mysqli_real_escape_string($conn, $values['sku']);
    $name = mysqli_real_escape_string($conn, $values['name']);
    $price = mysqli_real_escape_string($conn, $values['price']);
    $type = mysqli_real_escape_string($conn, $values['type']);

    if ($type === "DVD") {
      $size = mysqli_real_escape_string($conn, $values['size']);
      $query = "INSERT INTO products(sku,name,price,type,size) VALUES('$sku','$name','$price','$type','$size')";
    } elseif ($type === "Furniture") {
      $height = mysqli_real_escape_string($conn, $values['height']);
      $width = mysqli_real_escape_string($conn, $values['width']);
      $length = mysqli_real_escape_string($conn, $values['length']);
      $query = "INSERT INTO products(sku,name,price,type,height,width,length) VALUES('$sku','$name','$price','$type','$height','$width','$length')";
    } elseif ($type === "Book") {
      $weight = mysqli_real_escape_string($conn, $values['weight']);
      $query = "INSERT INTO products(sku,name,price,type,weight) VALUES('$sku','$name','$price','$type','$weight')";
    }

    // connect to db and make a query
    try {
      include 'db.php';
      mysqli_query($conn, $query);
      mysqli_close($conn);
      header("Location: list.php");
    } catch (Exception $e) {
      echo 'query error: ' . $e->getMessage() . '<br />';
    }
  }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="index.css" rel="stylesheet" type="text/css" />
  <title>Product Add</title>
</head>

<body>
  <nav>
    <div class="nav-title">Product Add</div>
    <button class="nav-btn" onclick="document.forms['product_form'].submit()">Save</button>
    <a href="http://localhost/list.php" class="nav-btn">Cancel</a>
  </nav>

  <main>
    <form id="product_form" class="form-wrapper" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
      <div class="form-section">
        <label>SKU</label>
        <input id="sku" type="text" name="sku" value="<?php echo $values['sku'] ?? '' ?>" />
        <div><?php echo $errors['sku'] ?? "" ?></div>

        <label>Name</label>
        <input id="name" type="text" name="name" value="<?php echo $values['name'] ?? '' ?>" />
        <div><?php echo $errors['name'] ?? "" ?></div>

        <label>Price ($)</label>
        <input id="price" type="number" name="price" value="<?php echo $values['price'] ?? '' ?>" />
        <div><?php echo $errors['price'] ?? "" ?></div>

        <label>Type Switcher</label>
        <select name="type" id="productType">
          <?php
          foreach ($types as $t) {
            echo "<option id=$t value=$t";
            if (!empty($values['type']) && $t === $values['type']) {
              echo ' selected';
            }
            echo ">$t</option>";
          }
          ?>
        </select>
        <div></div>
      </div>

      <div id="dvd-form" class="form-section form-dynamic">
        <label>Size (MB)</label>
        <input id="size" type="number" name="size" value="<?php echo $values['size'] ?? '' ?>" />
        <div><?php echo $errors['size'] ?? "" ?></div>
      </div>

      <dvd id="furniture-form" class="form-section form-dynamic">
        <label>Height (CM)</label>
        <input id="height" type="number" name="height" value="<?php echo $values['height'] ?? '' ?>" />
        <div><?php echo $errors['height'] ?? "" ?></div>

        <label>Width (CM)</label>
        <input id="width" type="number" name="width" value="<?php echo $values['width'] ?? '' ?>" />
        <div><?php echo $errors['width'] ?? "" ?></div>

        <label>Length (CM)</label>
        <input id="length" type="number" name="length" value="<?php echo $values['length'] ?? '' ?>" />
        <div><?php echo $errors['length'] ?? "" ?></div>
      </dvd>

      <div id="book-form" class="form-section form-dynamic">
        <label>Weight (KG)</label>
        <input id="weight" type="number" name="weight" value="<?php echo $values['weight'] ?? '' ?>" />
        <div><?php echo $errors['weight'] ?? "" ?></div>
      </div>
    </form>
  </main>

  <footer>test assignment</footer>

  <script>
    const selector = document.querySelector("#productType");
    const dvdSection = document.querySelector("#dvd-form");
    const furnitureSection = document.querySelector("#furniture-form");
    const bookSection = document.querySelector("#book-form");
    const dynamicSections = document.querySelectorAll(".form-dynamic");

    function updateSection() {
      dynamicSections.forEach(x => x.style.display = 'none');
      switch (selector.value) {
        case ("DVD"):
          dvdSection.style.display = 'grid';
          break;
        case ("Furniture"):
          furnitureSection.style.display = 'grid';
          break;
        case ("Book"):
          bookSection.style.display = 'grid';
          break;
      }
    }

    selector.addEventListener('change', updateSection);
    updateSection();
  </script>
</body>

</html>