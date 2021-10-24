<?php

header('Content-Type: application/json');

include 'connection.php';


if ( array_key_exists('page', $_GET) ) {

    /*
    $page_id = $_GET['page'];

    $query = $conn->prepare("SELECT * FROM sections WHERE page_id = 1");
    $params = [$page_id];
    $query->execute($params);

    $result = $query->fetchAll();


    $response = array("status"=>"success", "data"=>$result);

    echo json_encode($response);*/


    $query = $conn->prepare("SELECT * FROM sections WHERE page_id = ?");
    $query->execute( [ $_GET['page'] ] );

    $result = $query->fetchAll();

    $response = array("status"=>"success", "data"=>$result);
    echo json_encode( mb_convert_encoding($response, 'UTF-8', 'UTF-8'), JSON_PRETTY_PRINT, 500);


} elseif ( array_key_exists('pages', $_GET) ) {

    $query = $conn->prepare("SELECT * FROM pages");
    $query->execute();

    $result = $query->fetchAll();

    $response = array("status"=>"success", "data"=>$result);
    echo json_encode($response);



} elseif ( array_key_exists('create', $_GET) ) {

    if ( $_GET['create'] === "section") {
        $query = $conn->prepare("INSERT INTO sections ( name, content, page_id ) VALUES ( ?, ?, ?) ");
        $params = [$_GET['name'], "", $_GET['page_id']];
        $query->execute( $params );


        $response = array("status"=>"success", "data"=>"Created Record");
        echo json_encode($response);    
    }
}


$post_data =  json_decode( file_get_contents('php://input', true) );

if ( $post_data != NULL ) {

    $query = $conn->prepare("UPDATE sections set name = ?, content = ? WHERE id  = ?");
    $params = [$post_data->section_name, $post_data->section_content, $post_data->section_id];
    $query->execute($params);

    $response = array("status"=>"success", "data"=>"Updated the section content");
    echo json_encode($response);
}

if ( file_get_contents('php://input', true) != "" ) {
 json_decode( file_get_contents('php://input', true) );
}

?>

