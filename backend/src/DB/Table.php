<?php

namespace src\DB;

abstract class Table
{
    protected const SCHEMA_TYPE = "type";
    protected const SCHEMA_REQUIRED = "required";
    protected const SCHEMA_VALUES = "values";
    protected const TYPE_STRING = "string";
    protected const TYPE_NUMERIC = "numeric";

    protected $conn = null;

    protected $table = "table-name";

    protected $schema = [
        "field1" => [self::SCHEMA_TYPE => self::TYPE_STRING],
        "field2" => [
            self::SCHEMA_TYPE => self::TYPE_NUMERIC,
            self::SCHEMA_REQUIRED => true
        ],
        "field3" => [
            self::SCHEMA_TYPE => self::TYPE_STRING,
            self::SCHEMA_VALUES => ["value1", "value2"]
        ],
    ];

    protected $validationErrors = [];

    public function __construct(\PDO $conn)
    {
        $this->conn = $conn;
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

    public function create($entryMap)
    {
        $newEntry = $this->sanitizeEntry($entryMap);
        $this->validateEntry($newEntry);

        $fields = array_keys($newEntry);
        $query = $this->buildInsertQuery($fields);

        $smt = $this->conn->prepare($query);
        $smt->execute($newEntry);

        return $this->conn->lastInsertId();
    }

    public function deleteIds($ids)
    {
        function array_every($array, $cb)
        {
            foreach ($array as $val) {
                if (!$cb($val)) return false;
            }
            return true;
        }

        if (
            !is_array($ids) ||
            empty($ids) ||
            !array_every($ids, "is_int")
        ) {
            throw new ValidationError(["error" => "Request body must be a valid JSON array of integers"]);
        }

        $query = "DELETE FROM $this->table WHERE id=:id";
        $smt = $this->conn->prepare($query);
        $this->conn->beginTransaction();
        foreach ($ids as $id) {
            $smt->execute(["id" => $id]);
        }
        $this->conn->commit();
    }

    //
    // Helpers
    //

    protected function validateEntry($entryMap)
    {
        $tableFields = array_keys($this->schema);

        // check fields in entry against field_names
        $entryFields = array_keys($entryMap);
        foreach ($entryFields as $field) {
            if (!in_array($field, $tableFields)) {
                $this->validationErrors[$field] = "Field '$field' is not in the table schema.";
            }
        }

        // check entry data types against table scheme
        foreach ($tableFields as $field) {
            $type = $this->schema[$field][self::SCHEMA_TYPE];
            $required = $this->schema[$field][self::SCHEMA_REQUIRED];
            $values = $this->schema[$field][self::SCHEMA_VALUES];

            $typeCheck = "is_" . $type;
            $val = $entryMap[$field];

            if (empty($val) && !is_numeric($val)) {
                if ($required) $this->validationErrors[$field] = "Field '$field' is required.";
                continue;
            }

            // if (!in_array($type, $types)) {
            if (!$typeCheck($val)) {
                $this->validationErrors[$field] = "Value for field '$field' should be of type: $type";
                continue;
            }

            if (!empty($values) && !in_array($val, $values)) {
                $this->validationErrors[$field] = "Value for field '$field' should be one of: " . join(", ", $values);
            }
        }

        if (!empty($this->validationErrors)) {
            throw new ValidationError($this->validationErrors);
        }
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

    protected function buildInsertQuery(array $fields)
    {
        $q1 = "INSERT INTO $this->table (";

        $qFields = join(", ", $fields);

        $q2 = ") VALUES (";

        $qValues = join(",", array_map(function ($str) {
            return ":$str";
        }, $fields));

        $q3 = ")";

        return $q1 . $qFields . $q2 . $qValues . $q3;
    }
}
