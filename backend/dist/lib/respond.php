<?php

function respond($data, $code = null)
{
  header('Content-Type: application/json');
  if (isset($code)) {
    http_response_code($code);
  }
  echo json_encode($data);
  exit;
}
