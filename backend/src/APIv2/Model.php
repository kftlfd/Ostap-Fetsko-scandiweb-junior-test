<?php

namespace src\APIv2;

/**
 * Model class for mapping a database row to an object
 */
abstract class Model
{
    protected $id;

    /**
     * Fields that should be preserved as numeric when converting to JSON
     */
    protected function numericAttributes()
    {
        return ["id"];
    }

    /**
     * Order for attributes when converting to JSON
     */
    protected function attributeOrder()
    {
        return ["id"];
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
        $arr = get_object_vars($this);
        unset($arr["id"]);
        return $arr;
    }

    /**
     * Convert object to JSON string, preserving numericAttributes as numbers. \
     * Validate that all fields are set (e.g. $this->validate()) in advance.
     */
    public function toJSON()
    {
        $order = $this->attributeOrder();
        $numerics = $this->numericAttributes();
        $kvpairs = array_map(function ($key) use ($numerics) {
            $val = $this->$key;
            $val = in_array($key, $numerics) ? $val : "\"$val\"";
            return "\"$key\":$val";
        }, $order);
        return "{" . join(",", $kvpairs) . "}";
    }
}
