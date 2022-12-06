<?php

namespace App;

/**
 * Model class for mapping a database row to an object
 * (ActiveRecord-like)
 */
abstract class Model
{
    protected const FIELD_VALUE = "value";
    protected const FIELD_TYPE = "type";
    protected const FIELD_REQUIRED = "required";
    protected const FIELD_MAX_LEN = "maxlen";
    protected const FIELD_MAX = "max";
    protected const FIELD_MIN = "min";
    protected const FIELD_NEGATIVE = "negative";
    protected const FIELD_COMMENT = "comment";

    protected const TYPE_TEXT = "text";
    protected const TYPE_NUMBER = "number";

    protected const TABLE = "";
    protected const ID_FIELD = "id";

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
        $obj->setId(static::array_get($row, static::ID_FIELD));
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
        $result = static::find([static::ID_FIELD => $id]);
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
        if (!isset($this->data[$name])) return null;
        return $this->data[$name][self::FIELD_VALUE];
    }

    /**
     * Helper function, return key from array if set, else default
     */
    protected static function array_get(array $arr, $key, $default = null)
    {
        return isset($arr[$key]) ? $arr[$key] : $default;
    }

    /** 
     * Save value and type for a field in data array
     * @param string $field Name of the field
     * @param string|int|float $value Value for field
     * @param array $options Field attributes
     * @return bool `true` if `$value` has been assigned to the field
     */
    protected function setField(string $field, $value, array $options = [
        self::FIELD_REQUIRED => true,
        self::FIELD_TYPE => self::TYPE_TEXT,
        self::FIELD_MAX_LEN => null,
        self::FIELD_MAX => null,
        self::FIELD_MIN => null,
        self::FIELD_NEGATIVE => false,
        self::FIELD_COMMENT => "",
    ])
    {
        $required = static::array_get($options, self::FIELD_REQUIRED, true);
        $fieldtype = static::array_get($options, self::FIELD_TYPE, self::TYPE_TEXT);

        $prevValue = isset($this->data[$field]) ? $this->data[$field][self::FIELD_VALUE] : null;
        $newValue = $fieldtype === self::TYPE_NUMBER
            ? static::getSanitizedNumber($value, static::array_get($options, self::FIELD_NEGATIVE, false) === true)
            : static::getSanitizedString($value);

        $this->data[$field] = [
            self::FIELD_VALUE => isset($newValue) ? $newValue : $prevValue,
            self::FIELD_TYPE => $fieldtype,
            self::FIELD_REQUIRED => $required,
            self::FIELD_COMMENT => static::array_get($options, self::FIELD_COMMENT)
        ];

        if ($fieldtype === self::TYPE_TEXT) {
            $maxlen = static::array_get($options, self::FIELD_MAX_LEN);
            if (is_int($maxlen)) $this->data[$field][self::FIELD_MAX_LEN] = $maxlen;
        }

        if ($fieldtype === self::TYPE_NUMBER) {
            $max = static::array_get($options, self::FIELD_MAX);
            if (is_numeric($max)) $this->data[$field][self::FIELD_MAX] = +$max;

            $min = static::array_get($options, self::FIELD_MIN);
            if (is_numeric($min)) $this->data[$field][self::FIELD_MIN] = +$min;
        }

        return isset($newValue);
    }

    /**
     * @param int|null $id
     */
    final protected function setId($id = null)
    {
        $this->setField(static::ID_FIELD, $id, [
            self::FIELD_TYPE => self::TYPE_NUMBER
        ]);
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

        foreach ($this->data as $field => $info) {
            if ($field === static::ID_FIELD) continue;

            $fieldvalue = $info[self::FIELD_VALUE];
            $fieldtype = $info[self::FIELD_TYPE];

            if (!isset($fieldvalue)) {
                if ($info[self::FIELD_REQUIRED] === true) {
                    $err = "Field '$field' of type '$fieldtype' is required.";
                    $comment = static::array_get($info, self::FIELD_COMMENT);
                    if (isset($comment)) $err .= " $comment";
                    $errors[$field] = $err;
                }
                continue;
            }

            if ($fieldtype === self::TYPE_TEXT) {
                $maxlen = static::array_get($info, self::FIELD_MAX_LEN);
                if (is_numeric($maxlen) && strlen($fieldvalue) > (int)$maxlen) {
                    $errors[$field] = "Field '$field' should be less than $maxlen characters long.";
                    continue;
                }
            }

            if ($fieldtype === self::TYPE_NUMBER) {
                $max = static::array_get($info, self::FIELD_MAX);
                if (is_numeric($max) && $fieldvalue > (float)$max) {
                    $errors[$field] = "Field '$field' should be less than $max.";
                    continue;
                }

                $min = static::array_get($info, self::FIELD_MIN);
                if (is_numeric($min) && $fieldvalue < (float)$min) {
                    $errors[$field] = "Field '$field' should be more than $min.";
                }
            }
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
