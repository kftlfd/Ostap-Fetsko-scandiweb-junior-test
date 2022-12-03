<?php

namespace src\APIv2;

/**
 * Model class for mapping a database row to an object
 * (ActiveRecord-like)
 */
abstract class Model
{
    protected const FIELD_VALUE = "value";
    protected const FIELD_TYPE = "type";
    protected const TYPE_TEXT = "text";
    protected const TYPE_NUMBER = "number";

    protected const TABLE = "";
    protected $data;

    /**
     * Get database adapter
     */
    protected static function getAdapter()
    {
        return new DBAdapter(static::TABLE);
    }

    /**
     * Declare model schema via setField(...) statements \
     * Note: don't set instance's id from `$attributes` param, 
     * specify only `$this->setId();` instead. \
     * Setting id is done internally in `save()` and `static::load()` methods
     * @param array $attributes Array of $key=>$value pairs
     */
    public function __construct(array $attributes)
    {
    }

    /**
     * For loading objects from table rows
     * @param array $row
     * @return static
     */
    protected static function load(array $row)
    {
        $obj = new static($row);
        $obj->setId($row["id"]);
        return $obj;
    }

    /**
     * Search model's table
     * @param array $clause Array of [$field => $value, ...] pairs
     * @param int $limit Limit search results. No limit by default
     * @param bool $desc List rows in reverse order
     * @return static[]
     */
    public static function find(array $clause, int $limit = null, $desc = false)
    {
        $adapter = static::getAdapter();
        $result = $adapter->select($clause, $limit, $desc);
        if (!$result) return [];
        return array_map(function ($row) {
            return static::load($row);
        }, $result);
    }

    /**
     * @param int $id
     * @return static|null
     */
    public static function getById(int $id)
    {
        $result = static::find(["id" => $id]);
        if (!$result) return null;
        return $result[0];
    }

    /**
     * @return static[]
     */
    public static function getAll()
    {
        return static::find([]);
    }

    /** 
     * Overload getters to fetch properties from data array 
     * @return string|int|float|null
     */
    public function __get(string $name)
    {
        if (!$this->data[$name]) return null;
        return $this->data[$name][self::FIELD_VALUE];
    }

    /** 
     * Save value and type for a field in data array
     * @param string $field Name of the field
     * @param string|int|float $value Value for field
     * @param bool $numeric Specify if value is a number
     * @param bool $negative For numeric values specify if it can be negative (by default use positive/absolute value)
     */
    protected function setField(string $field, $value, $numeric = false, $negative = false)
    {
        $type = $numeric ? self::TYPE_NUMBER : self::TYPE_TEXT;
        $prevValue = $this->data[$field] ? $this->data[$field][self::FIELD_VALUE] : null;
        $newValue = $numeric
            ? static::getSanitizedNumber($value, $negative)
            : static::getSanitizedString($value);

        if (!isset($newValue)) {
            $this->data[$field] = [
                self::FIELD_VALUE => $prevValue,
                self::FIELD_TYPE => $type,
            ];
            return False;
        }

        $this->data[$field] = [
            self::FIELD_VALUE => $newValue,
            self::FIELD_TYPE => $type,
        ];
        return True;
    }

    /**
     * @param int|null $id
     */
    protected function setId($id = null)
    {
        $this->setField("id", $id, true);
    }

    /**
     * Get sanitized non-empty string or null
     * @param string $s Input
     * @return string|null
     */
    protected static function getSanitizedString($s)
    {
        if (!is_string($s)) return null;
        $s = trim($s);
        $s = strip_tags($s);
        $s = htmlspecialchars($s);
        return !empty($s) ? $s : null;
    }

    /**
     * Get valid number or null
     * @param int|float $n Input
     * @param bool $negative Specify if output can be negative. By default output positive (absolute) value
     * @return int|float|null
     */
    protected static function getSanitizedNumber($n, $negative = false)
    {
        if (!is_numeric($n)) return null;
        if ($negative) return +$n;
        return abs(+$n);
    }

    /**
     * Validate data before saving to database, return array of errors if any
     * @return array|null
     */
    public function validate()
    {
        $errors = [];

        // Check if all fields are present
        // Fields should be already sanitized through setters
        $data = $this->toDataArray();
        foreach ($data as $key => $val) {
            if (isset($val)) continue;
            $errors[$key] = "Field '$key' of type '{$this->data[$key][self::FIELD_TYPE]}' is required.";
        }

        return !empty($errors) ? $errors : null;
    }

    /**
     * Save (insert/update) object to database
     * @throws ValidationError
     * @return void
     */
    public function save()
    {
        $errors = $this->validate();
        if (!empty($errors)) throw new ValidationError($errors);

        $adapter = static::getAdapter();
        $data = $this->toDataArray();
        $id = $this->id;

        if (isset($id)) {
            $adapter->update($id, $data);
        } else {
            $id = $adapter->insert($data);
            $this->setId($id);
        }
    }

    /**
     * Delete object from database
     * @return void
     */
    public function delete()
    {
        $id = $this->id;
        if (!isset($id)) {
            echo "not saved";
            return;
        }
        $adapter = static::getAdapter();
        $adapter->delete($id);
    }

    /**
     * Get assoc array of object's data, excluding id
     */
    public function toDataArray()
    {
        $arr = [];
        foreach ($this->data as $key => $info) {
            $arr[$key] = $info[self::FIELD_VALUE];
        }
        unset($arr["id"]);
        return $arr;
    }

    /**
     * Convert object's data to JSON string. \
     * Note: if value for field is not set (is null), it will be converted as empty string or zero.
     */
    public function toJSON()
    {
        $kvpairs = [];
        foreach ($this->data as $key => $info) {
            $type = $info[self::FIELD_TYPE];
            $val = $info[self::FIELD_VALUE];

            $val = $type === self::TYPE_NUMBER ? $val : "\"$val\"";
            if (!isset($val) && $type === self::TYPE_NUMBER) $val = 0;

            $kvpairs[] = "\"$key\":$val";
        }
        return "{" . join(",", $kvpairs) . "}";
    }
}
