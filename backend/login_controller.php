<?php
include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

include 'connection.php';

$email      = trim( $_POST['email'] );
$password   = $_POST['password'];

$stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
$params = [ $email ];
$stmt->execute($params);

$result = $stmt->fetchAll();

var_dump( $result );

if ( count($result) == 0 ) {
    echo "That email does not exist in our system";
    die();
}


// RIGHT NOW this code assumes that every email in our users table unique

if ( password_verify( $password, $result[0]["password"] ) === false ) {
    echo "Password did not match";
    die();
}


$_SESSION["user_id"] = $result[0]["id"];

echo "Logged in Successfully!";
echo "User id: " . $result[0]["id"];
echo "session id: " . session_id();
header("Location: ../settings.php");


?>
