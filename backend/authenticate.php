<?php

include 'connection.php';

$email      = trim( $_POST['email'] );
$password   = $_POST['password'];

$stmt = $conn->prepare("SELECT email, password FROM users WHERE email = ? AND password = ?");
$params = [$email, $password];
$stmt->execute($params);

$result = $stmt->fetchAll();

if ( count($result) == 0 ) {
    die();
}

if ($result[0]["email"] == $email &&
    $result[0]["password"] == $password) {

    echo "Logged in Successfully!";
    header("Location: settings.php");
}

?>
