<?php
include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

$target_directory   = "../" . $_POST["directory_path"];
$target_file        = $target_directory.basename( $_FILES["file_to_upload"]["name"] );


$real_path_array = explode("\\", realpath($target_directory) );
// If "files" is in the absolute path, then we can guarantee
// that the directory we are in is either Inside "files" of "files" itself
// if not, then return a "Not Found" code
if ( in_array( "files", $real_path_array ) == false ) {
    http_response_code(404);
    header("Location: ../files.php");
    return;
}

move_uploaded_file(
    $_FILES["file_to_upload"]["tmp_name"], 
    $target_file
);

header("Location: ../files.php");

?>
