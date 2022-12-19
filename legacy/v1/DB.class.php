<?php

class DB
{
  private $conn;

  function __construct()
  {
    $host = $_ENV["MYSQL_HOST"];
    $dbname = $_ENV["MYSQL_DATABASE"];
    $user = $_ENV["MYSQL_USER"];
    $password = $_ENV["MYSQL_PASSWORD"];

    $dsn = "mysql:host=$host;dbname=$dbname";
    try {
      $this->conn = new PDO($dsn, $user, $password);
    } catch (Exception $e) {
      echo $e->getMessage();
      die();
    }
  }

  function close()
  {
    $this->conn = null;
  }

  function get_all_products()
  {
    $query = "SELECT * FROM products";
    try {
      $result = $this->conn->query($query);
      return $result->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
      echo $e->getMessage();
    }
  }

  function delete_products($ids)
  {
    foreach ($ids as $id) {
      try {
        $this->conn->query("DELETE FROM products WHERE id = $id");
      } catch (Exception $e) {
        echo $e->getMessage();
      }
    }
  }
}
