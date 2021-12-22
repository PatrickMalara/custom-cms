<?php
include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();
error_reporting(E_ERROR | E_PARSE);
//error_reporting(E_ALL);

include "secret.php";

// get the HTTP method, path and body of the request
$method     = $_SERVER[ 'REQUEST_METHOD' ];                         // the HTTP Method
$request    = explode( '/', trim($_SERVER['REQUEST_URI'],'/') );    // the Path
$input      = json_decode( file_get_contents('php://input'), true); // Body of the Request

// connect to the mysql database
$link = mysqli_connect( $servername, $dbuser, $dbpass, $dbname);
mysqli_set_charset( $link,'utf8' );

/* Only Admins can Delete
 * 
 * Here we select the COUNT of users WHERE their ID is equal to the user_id of this SESSION
 * and check if that user_id, tied to this SESSION, has is_admin equal to 1
 */
if ( $method == "DELETE" ) {
    $sql = "SELECT COUNT(*) FROM users WHERE id = '" . $_SESSION["user_id"] . "' AND is_admin = 1 ";

    // excecute SQL statement
    $result = mysqli_query($link, $sql);

    if ( mysqli_fetch_assoc($result)["COUNT(*)"] == 0 ) {
        echo "failing on the is_admin sql " . $_SESSION["user_id"] ;
      http_response_code( 403 );
      die();
    }
}

/*
 * Here we try to get the index of 'api.php' in the PATH
 * This will help us get the Table Name, since the Table Name
 * will be the next element in the $request.
 */
$api_index = 0;
for ($i = 0; $i < count($request); $i++) {
    if ( $request[$i] === "api.php") {
        $api_index = $i;
        $break;
    }
}

// Retrieve the Table and Key from the Path
$table  = $request[ $api_index + 1 ];
$key    = count($request) > ($api_index + 2) ? $request[ $api_index + 2] : NULL; // api.php/posts/1 -> [ 'site_name', 'backend', api.php', 'posts', 1 ]


// This API does not CRUD on Users. Other Controllers do...
if ( $table == "users" ) {
    http_response_code( 404 );
    die();   
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
  $set .= ($i > 0 ? ',' : '') . '`' . $columns[$i] . '`=';
  $set .= ($values[$i] === null ? 'NULL' : '"' . $values[$i] . '"');
}


$sql = "SELECT COUNT(*) FROM sessions WHERE session_id = '" . session_id() . "' AND session_data != '' ";

// excecute SQL statement
$result = mysqli_query($link, $sql);

if ( mysqli_fetch_assoc($result)["COUNT(*)"] == 0 ) {
    echo "failing on the session_id sql";
  http_response_code( 403 );
  die();
}


 
// create SQL based on HTTP method
switch ($method) {
  case 'GET':
    $sql = "select * from `$table`". (is_null($key) == false ? " WHERE id = $key" : ''); break;
  case 'PUT':
    $sql = "update `$table` set $set where id=$key"; break;
  case 'POST':
    $sql = "insert into `$table` set $set"; break;
  case 'DELETE':
    $sql = "delete from `$table` where id=$key"; break;
}


// excecute SQL statement
$result = mysqli_query($link,$sql);

//echo "sql: " . $sql;
//var_dump($link);
 
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
