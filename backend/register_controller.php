<?php
include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

header('Content-Type: application/json');

$link = new mysqli( $servername, $dbuser, $dbpass, $dbname);

// Make sure the session_id is valid
$sql = "SELECT COUNT(*) FROM sessions WHERE session_id = '" . session_id() . "' AND session_data != '' ";

// excecute SQL statement
$result = mysqli_query($link, $sql);

if ( mysqli_fetch_assoc($result)["COUNT(*)"] == 0 ) {
    echo "failing on the session_id sql";
  http_response_code( 403 );
  die();
}

$sql = "SELECT COUNT(*) FROM users WHERE id = '" . $_SESSION["user_id"] . "' AND is_admin = 1 ";

// excecute SQL statement
$result = mysqli_query($link, $sql);

if ( mysqli_fetch_assoc($result)["COUNT(*)"] == 0 ) {
    echo "failing on the is_admin sql";
  http_response_code( 403 );
  die();
}


$input = json_decode( file_get_contents('php://input'), true);

$user_id = uniqid();
$pass_hashed = password_hash( $input["password"], PASSWORD_BCRYPT);

//$sql = "INSERT INTO users SET id = \"$user_id\", first_name=\"$input["first_name"]\", last_name=\"$input["last_name"]\", email=\"$input["email"]\", password=\"$pass_hashed\" ";

$stmt = $link->prepare( "INSERT INTO users (id, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?) " );
$stmt->bind_param("sssss", $user_id, $input["first_name"], $input["last_name"], $input["email"], $pass_hashed );

// excecute SQL statement
$stmt->execute();

?>
