<?php

include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

header('Content-Type: application/json');

// get the HTTP method, path and body of the request
$method     = $_SERVER[ 'REQUEST_METHOD' ];
$request    = explode( '/', trim($_SERVER['REQUEST_URI'],'/') );
$input      = json_decode( file_get_contents('php://input'), true);

$key = htmlspecialchars($request[ count($request) - 1]) == 'users_controller.php' ? NULL : htmlspecialchars($request[ count($request) - 1]);

// connect to the mysql database
$link = mysqli_connect( $servername, $dbuser, $dbpass, $dbname);
mysqli_set_charset( $link,'utf8' );

if ( $method == "PUT" || $method == "DELETE" ) {
    $sql = "SELECT COUNT(*) FROM users WHERE id = '" . $_SESSION["user_id"] . "' AND is_admin = 1 ";

    // excecute SQL statement
    $result = mysqli_query($link, $sql);

    if ( mysqli_fetch_assoc($result)["COUNT(*)"] == 0 ) {
        echo "failing on the is_admin sql";
      http_response_code( 403 );
      die();
    }
}


$columns = [];
// escape the columns and values from the input object
if ( is_null($input) == false ) {
    $columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
    $values = array_map( function ($value) use ($link) {
            if ($value === null) { 
                return null; 
            }
            return mysqli_real_escape_string($link,(string)$value);
        },
        array_values($input)
    );
}

// build the SET part of the SQL command
$set = '';
for ($i = 0; $i < count($columns); $i++) {

    if ( $columns[i] != "password" ) {
      $set.=($i>0?',':'').'`'.$columns[$i].'`=';
      $set.=($values[$i]===null?'NULL':'"'.$values[$i].'"');
    }
}

$sql = "";
 
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $sql = "select id, first_name, last_name, email, is_admin from users ". (is_null($key) == false ? " WHERE id = `$key`" : ''); break;
  case 'PUT':
    $sql = "update users set $set where id=\"$key\""; break;
  case 'DELETE':
    $sql = "delete from users where id=$key"; break;
}


// excecute SQL statement
$result = mysqli_query($link,$sql);

//var_dump($result);
 
// die if SQL statement failed
if ( !$result ) {
  http_response_code( 404 );
  die( mysqli_error() );
}

 
// print results, insert id or affected row count
if ($method == 'GET') {
  if (!$key) echo '[';

  for ($i=0; $i<mysqli_num_rows($result); $i++) {
    echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
  }

  if (!$key) echo ']';

} elseif ($method == 'POST') {
  echo mysqli_insert_id($link);

} else {
  echo mysqli_affected_rows($link);
}
 

// close mysql connection
mysqli_close($link);

?>
