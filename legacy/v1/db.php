<?php

// $conn = mysqli_connect('localhost', 'junior', 'junior-test', 'junior_test');
$conn = mysqli_connect($_ENV["MYSQL_HOST"], $_ENV["MYSQL_USER"], $_ENV["MYSQL_PASSWORD"], $_ENV["MYSQL_DATABASE"]);

if (!$conn) {
  echo 'Connection error: ' . mysqli_connect_error() . '<br />';
} else {
  // echo 'Connected to db' . '<br />';
}
