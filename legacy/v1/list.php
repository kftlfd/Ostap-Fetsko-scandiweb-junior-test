<?php
require 'DB.class.php';
require 'Product.class.php';

$db = new DB();

// handle mass delete form
if ($_SERVER['REQUEST_METHOD'] === "POST") {
  $db->delete_products($_POST['to_delete']);
}

// fetch products
$products = $db->get_all_products();

// close db
$db->close();
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="index.css" rel="stylesheet" type="text/css" />
  <title>Product list</title>
</head>

<body>
  <nav>
    <div class="nav-title">Product List</div>
    <a href="http://localhost/add.php" class="nav-btn">ADD</a>
    <button class="nav-btn" onclick="document.forms['delete-form'].submit()">MASS DELETE</button>
  </nav>

  <main>
    <form class="products" name="delete-form" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="POST">
      <?php
      foreach ($products as $product) {
        $p = new Product($product);
        echo $p->render();
      }
      ?>
    </form>
  </main>

  <footer>test assignment</footer>
</body>

</html>