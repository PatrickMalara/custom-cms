<?php

include 'connection.php';

$new_site_name = trim( $_REQUEST['site_name'] );

echo ( $new_site_name );

$stmt = $conn->prepare("UPDATE site SET name = ?");
$params = [$new_site_name];
$stmt->execute($params);


header("Location: settings.php");
?>
