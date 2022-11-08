<?php

namespace DB;

require_once __DIR__ . "/" . "../Autoloader.php";
\Autoloader::register("../");

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
    $db_host = getenv("MYSQL_HOST");
    $db_name = getenv("MYSQL_DATABASE");
    $db_user = getenv("MYSQL_USER");
    $db_pass = getenv("MYSQL_PASSWORD");

    // default values
    if (empty($db_host)) $db_host = "host";
    if (empty($db_name)) $db_name = "database";
    if (empty($db_user)) $db_user = "user";
    if (empty($db_pass)) $db_pass = "password";

    $this->conn = new \PDO(
      "mysql:host=$db_host;dbname=$db_name",
      $db_user,
      $db_pass,
      [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
      ]
    );

    $this->field_names = array_keys($this->schema);
  }

  //
  // Data operations
  //

  public function select_all()
  {
    $query = "SELECT * FROM $this->table";
    $data = $this->conn->query($query)->fetchAll();
    return $data;
  }

  public function select_where($field, $value)
  {
    if (is_string($value)) $value = "'$value'";
    $query = "SELECT * FROM $this->table WHERE $field = $value";
    $data = $this->conn->query($query)->fetchAll();
    return $data;
  }

  public function delete_ids($ids)
  {
    $query = "DELETE FROM $this->table WHERE id=:id";
    $smt = $this->conn->prepare($query);
    $this->conn->beginTransaction();
    foreach ($ids as $id) {
      $smt->execute(["id" => $id]);
    }
    $this->conn->commit();
  }

  public function create($entry_map)
  {
    // check input
    if (empty($entry_map)) throw new \Exception("Empty input");
    $validation_errors = $this->validate_entry($entry_map);
    if (!empty($validation_errors)) return $validation_errors;

    // sanitize entry
    $new_entry = $this->sanitize_entry($entry_map);

    // insert to db
    $fields = array_keys($new_entry);
    $query = $this->build_insert_query($fields);
    $smt = $this->conn->prepare($query);
    $smt->execute($new_entry);
    return $this->conn->lastInsertId();
  }

  //
  // Helpers
  //

  function validate_entry($entry_map)
  {
    $errors = [];
    $table_fields = $this->field_names;

    // check fields in entry against field_names
    $entry_fields = array_keys($entry_map);
    foreach ($entry_fields as $field) {
      if (!in_array($field, $table_fields)) {
        $errors[$field] = "Field '$field' is not in the database.";
      }
    }

    // check entry data types against table scheme
    foreach ($table_fields as $field) {
      $required = $this->schema[$field]["required"];
      $types = $this->schema[$field]["types"];
      $values = $this->schema[$field]["values"];

      $val = $entry_map[$field];
      $type = gettype($val);

      if (!isset($val)) {
        if ($required) $errors[$field] = "Field '$field' is required.";
        continue;
      }

      if (!in_array($type, $types)) {
        $errors[$field] = "Value for field '$field' should be of type: " .
          implode(\Utilities::insert_pipes($types));
        continue;
      }

      if (!empty($values) && !in_array($val, $values)) {
        $errors[$field] = "Value for field '$field' should be one of: " .
          implode(\Utilities::insert_commas($values));
      }
    }

    return $errors;
  }

  protected function sanitize_entry($entry_map)
  {
    $keys = array_keys($entry_map);
    foreach ($keys as $key) {
      $val = $entry_map[$key];
      if (is_string($val)) {
        $val = strip_tags($val);
        $val = htmlspecialchars($val);
        $val = stripslashes($val);
        $val = trim($val);
      }
      $entry_map[$key] = $val;
    }
    return $entry_map;
  }

  protected function build_insert_query($fields)
  {
    $q1 = ["INSERT INTO $this->table ("];
    $q_fields = \Utilities::insert_commas($fields);
    $q2 = [") VALUES ("];
    $q_values = array_map("\Utilities::prepend_colon", $q_fields);
    $q3 = [")"];
    return implode(array_merge($q1, $q_fields, $q2, $q_values, $q3));
  }
}
