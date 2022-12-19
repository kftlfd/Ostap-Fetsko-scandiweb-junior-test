<?php

function get_db()
{
  // Try to get connection variables from environment
  $db_host = getenv('MYSQL_HOST');
  $db_name = getenv('MYSQL_DATABASE');
  $db_user = getenv('MYSQL_USER');
  $db_pass = getenv('MYSQL_PASSWORD');

  // Default fallback values
  if (empty($db_host)) $db_host = "default_host";
  if (empty($db_name)) $db_name = "default_name";
  if (empty($db_user)) $db_user = "default_user";
  if (empty($db_pass)) $db_pass = "default_password";

  $db = new PDO(
    "mysql:host=$db_host;dbname=$db_name",
    $db_user,
    $db_pass,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]
  );

  return $db;
}
