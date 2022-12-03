<?php

namespace src\APIv2;

/**
 * Translation layer for CRUD operations on database
 */
class DBAdapter
{
    private $db;
    private $table;

    public function __construct(string $tableName)
    {
        $this->db = (DBConn::getInstanse())->getConnection();
        $this->table = $tableName;
    }

    /**
     * Select rows from DB
     * @param array $clause Array of [$field => $value] pairs, for condition: 'WHERE field = value', conditions are connected with 'AND'.
     * @param int $limit Limit number of rows. No limit by default
     * @param bool $desc List rows in descending order
     */
    public function select(array $clause = [], int $limit = null, $desc = false)
    {
        $query = "SELECT * FROM {$this->table}";

        if (!empty($clause)) {
            $conditions = [];
            foreach ($clause as $field => $val) {
                if (is_string($val)) $val = "'$val'";
                $conditions[] = "$field = $val";
            }
            $query .= " WHERE " . join(" AND ", $conditions);
        }

        if (isset($limit)) {
            $limit = (int)$limit;
            $query .= " LIMIT $limit";
        }

        if ($desc) {
            $query .= " ORDER BY id DESC";
        }

        return $this->db->query($query)->fetchAll();
    }

    /**
     * Insert new row to database
     * @param array $data Array of [$field => $value] pairs
     */
    public function insert(array $data)
    {
        unset($data["id"]);
        $keys = array_keys($data);
        $fields = join(",", $keys);
        $vals = join(",", array_map(function ($s) {
            return ":$s";
        }, $keys));
        $query = "INSERT INTO products ($fields) VALUES ($vals)";
        $smt = $this->db->prepare($query);
        $smt->execute($data);
        return (int)$this->db->lastInsertId();
    }

    /**
     * Update row with specified ID
     * @param int $id Row ID
     * @param array $data Array of [$field => $value] pairs
     */
    public function update(int $id, array $data)
    {
        $keys = array_keys($data);
        $fields = join(",", array_map(function ($s) {
            return "$s = :$s";
        }, $keys));
        $query = "UPDATE {$this->table} SET $fields WHERE id = $id";
        $smt = $this->db->prepare($query);
        $smt->execute($data);
    }

    /**
     * Delete row with specified ID
     * @param int $id Row ID
     */
    public function delete(int $id)
    {
        $query = "DELETE FROM {$this->table} WHERE id=:id";
        $smt = $this->db->prepare($query);
        $smt->execute(["id" => $id]);
    }
}
