<?php

namespace DB;

use PDO;

abstract class Table
{
  protected $conn = null;

  protected $table = "table-name";

  protected $schema = [
    "field1" => ["types" => ["string"]],
    "field2" => ["types" => ["integer", "double"], "required" => "true"],
    "field3" => ["types" => ["string"], "values" => ["value1", "value2"]],
  ];

  function __construct()
  {
    $dbHost = getenv("MYSQL_HOST");
    $dbName = getenv("MYSQL_DATABASE");
    $dbUser = getenv("MYSQL_USER");
    $dbPass = getenv("MYSQL_PASSWORD");

    // default values
    if (empty($dbHost)) $dbHost = "host";
    if (empty($dbName)) $dbName = "database";
    if (empty($dbUser)) $dbUser = "user";
    if (empty($dbPass)) $dbPass = "password";

    $this->conn = new PDO(
      "mysql:host=$dbHost;dbname=$dbName",
      $dbUser,
      $dbPass,
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
      ]
    );

    $this->fieldNames = array_keys($this->schema);
  }

  //
  // Data operations
  //

  public function selectAll()
  {
    $query = "SELECT * FROM $this->table";
    $data = $this->conn->query($query)->fetchAll();
    return $data;
  }

  public function selectWhere($field, $value)
  {
    if (is_string($value)) $value = "'$value'";
    $query = "SELECT * FROM $this->table WHERE $field = $value";
    $data = $this->conn->query($query)->fetchAll();
    return $data;
  }

  public function deleteIds($ids)
  {
    $query = "DELETE FROM $this->table WHERE id=:id";
    $smt = $this->conn->prepare($query);
    $this->conn->beginTransaction();
    foreach ($ids as $id) {
      $smt->execute(["id" => $id]);
    }
    $this->conn->commit();
  }

  public function create($entryMap)
  {
    // check input
    if (empty($entryMap)) throw new \Exception("Empty input");
    $validationErrors = $this->validateEntry($entryMap);
    if (!empty($validationErrors)) return $validationErrors;

    // sanitize entry
    $newEntry = $this->sanitizeEntry($entryMap);

    // insert to db
    $fields = array_keys($newEntry);
    $query = $this->buildInsertQuery($fields);
    $smt = $this->conn->prepare($query);
    $smt->execute($newEntry);
    return $this->conn->lastInsertId();
  }

  //
  // Helpers
  //

  function validateEntry($entryMap)
  {
    $errors = [];
    $tableFields = $this->fieldNames;

    // check fields in entry against field_names
    $entryFields = array_keys($entryMap);
    foreach ($entryFields as $field) {
      if (!in_array($field, $tableFields)) {
        $errors[$field] = "Field '$field' is not in the database.";
      }
    }

    // check entry data types against table scheme
    foreach ($tableFields as $field) {
      $required = $this->schema[$field]["required"];
      $types = $this->schema[$field]["types"];
      $values = $this->schema[$field]["values"];

      $val = $entryMap[$field];
      $type = gettype($val);

      if (!isset($val)) {
        if ($required) $errors[$field] = "Field '$field' is required.";
        continue;
      }

      if (!in_array($type, $types)) {
        $errors[$field] = "Value for field '$field' should be of type: " .
          join(" | ", $types);
        continue;
      }

      if (!empty($values) && !in_array($val, $values)) {
        $errors[$field] = "Value for field '$field' should be one of: " .
          join(", ", $values);
      }
    }

    return $errors;
  }

  protected function sanitizeEntry($entryMap)
  {
    $keys = array_keys($entryMap);
    foreach ($keys as $key) {
      $val = $entryMap[$key];
      if (is_string($val)) {
        $val = strip_tags($val);
        $val = htmlspecialchars($val);
        $val = stripslashes($val);
        $val = trim($val);
      }
      $entryMap[$key] = $val;
    }
    return $entryMap;
  }

  protected function buildInsertQuery($fields)
  {
    $q1 = ["INSERT INTO $this->table ("];
    $qFields = \Utilities::insert_commas($fields);
    $q2 = [") VALUES ("];
    $qValues = array_map("\Utilities::prepend_colon", $qFields);
    $q3 = [")"];
    return implode(array_merge($q1, $qFields, $q2, $qValues, $q3));
  }
}
