<?php

include 'MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

header('Content-Type: application/json');

// get the HTTP method, path and body of the request
$method     = $_SERVER[ 'REQUEST_METHOD' ];
$request    = explode( '/', trim($_SERVER['PATH_INFO'],'/') );
$input      = json_decode( file_get_contents('php://input'), true);

// retrieve the table from the path
$table  = preg_replace('/[^a-z0-9_]+/i', '', array_shift($request) );


// escape the columns and values from the input object
$columns = preg_replace('/[^a-z0-9_]+/i','',array_keys($input));
$values = array_map( function ($value) use ($link) {
        if ($value === null) { 
            return null; 
        }
        return mysqli_real_escape_string($link,(string)$value);
    },
    array_values($input)
);



switch ($method) {
    
    case "GET":

        if ( isset($_GET['path']) ) {

            $path = "../" . htmlspecialchars($_GET['path']);

            $real_path_array = explode("\\", realpath($path) );

            // If "files" is in the absolute path, then we can guarantee
            // that the directory we are in is either Inside "files" of "files" itself
            // if not, then return a "Not Found" code
            if ( in_array( "files", $real_path_array ) == false ) {
                http_response_code(404);
                return;
            }

            // Scans for Files and Folders
            $scanned_directory = scandir('./'.$path);
            $response = array();


            // I know I am repeating myself, but this is just more readable, honesltly not sure if I
            // want to structure things this way

            if ( $input["entity"] === "folders" ) {
                for ( $i = 2; $i < count($scanned_directory); $i++ ) {              // First 2 are '.' and '..'
                    if ( is_dir( $path . $scanned_directory[$i]) === true ) {
                        array_push( $response, $scanned_directory[$i] ); 
                    }
                }

            } elseif ( $input["entity"] === "files" ) {                             // First 2 are '.' and '..'
                for ( $i = 2; $i < count($scanned_directory); $i++ ) {
                    if ( is_dir( $path . $scanned_directory[$i] ) === false ) {
                        array_push( $response, $scanned_directory[$i] ); 
                    }
                }

            } else {

                $response["folders"]    = array();
                $response["files"]      = array();
                for ( $i = 2; $i < count($scanned_directory); $i++ ) {

                    if ( is_dir( $path . $scanned_directory[$i] ) === false ) {
                        array_push( $response["files"], $scanned_directory[$i] ); 
                    } else {
                        array_push( $response["folders"], $scanned_directory[$i] ); 
                    }

                }

            }


            echo json_encode($response);

        }

        
        break;
    case "POST": // Create a File.txt or Folder
        
        if ( isset($input['path']) && isset($input['folder_name']) ) { 



            $new_folder_path = "../" . $input["path"] . $input['folder_name'] . "/";

            $real_path_array = explode("\\", realpath($new_folder_path) );
            // If "files" is in the absolute path, then we can guarantee
            // that the directory we are in is either Inside "files" of "files" itself
            // if not, then return a "Not Found" code
            if ( in_array( "files", $real_path_array ) == false ) {
                http_response_code(404);
                return;
            }

            if ( file_exists( $new_folder_path ) === true) {
                http_response_code(403);
                die();
                return;
            }    

            mkdir( $new_folder_path , 0777, true);

        }

        break;
    case "PUT":
            // Edit the File or Folder name
        break;
    case "DELETE":
            // Delete the File or Folder
        break;

}

?>
