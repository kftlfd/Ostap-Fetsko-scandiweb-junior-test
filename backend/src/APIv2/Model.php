<?php

namespace src\APIv2;

/**
 * Model class for mapping a database row to an object
 */
abstract class Model
{
    protected const FIELD_VALUE = "value";
    protected const FIELD_TYPE = "type";
    protected const TYPE_TEXT = "text";
    protected const TYPE_NUMBER = "number";

    protected $data;

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
     * Overload getters to fetch properties from data array 
     * @return string|int|float|null
     */
    public function __get(string $name)
    {
        if (!$this->data[$name]) return null;
        return $this->data[$name][self::FIELD_VALUE];
    }

    /**
     * Validate data before saving to database, return array of errors if any
     * @return array|null
     */
    abstract public function validate();

    /**
     * Save (insert/update) object to database
     * @return void
     */
    abstract public function save();

    /**
     * Delete object from database
     * @return void
     */
    abstract public function delete();

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
     * Get assoc array of product's attributes, excluding id
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
     * Convert object to JSON string, preserving numericAttributes as numbers. \
     * Validate that all fields are set (e.g. $this->validate()) in advance.
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
