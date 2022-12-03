<?php

namespace src\APIv2;

use PDO;

/**
 * Establish a connection to database
 */
class DBConn
{
    private static $instance;

    /** @var PDO */
    private $conn;

    private function __construct()
    {
        $dbHost = $_ENV["MYSQL_HOST"];
        $dbName = $_ENV["MYSQL_DATABASE"];
        $dbUser = $_ENV["MYSQL_USER"];
        $dbPass = $_ENV["MYSQL_PASSWORD"];

        $this->conn = new PDO(
            "mysql:host=$dbHost;dbname=$dbName",
            $dbUser,
            $dbPass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
    }

    public static function getInstanse()
    {
        if (self::$instance == null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection()
    {
        return $this->conn;
    }
}
