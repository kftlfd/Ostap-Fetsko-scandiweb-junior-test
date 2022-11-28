<?php

namespace src\APIv1;

use PDO;

class DBConfig
{
    /** @return PDO */
    public static function getConn()
    {
        $dbHost = $_ENV["MYSQL_HOST"];
        $dbName = $_ENV["MYSQL_DATABASE"];
        $dbUser = $_ENV["MYSQL_USER"];
        $dbPass = $_ENV["MYSQL_PASSWORD"];

        $conn = new PDO(
            "mysql:host=$dbHost;dbname=$dbName",
            $dbUser,
            $dbPass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );

        return $conn;
    }
}
