<?php
include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

$target_directory   = $_POST["directory_path"] . "/";
$target_file        = $target_directory.basename( $_FILES["file_to_upload"]["name"] );

move_uploaded_file(
    $_FILES["file_to_upload"]["tmp_name"], 
    $target_file
);

header("Location: files.php");

?>
