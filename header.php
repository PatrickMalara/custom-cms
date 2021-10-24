<?php

include 'backend/MySQLSessionHandler.php';

$the_session_handler = new MySQLSessionHandler();
session_set_save_handler( $the_session_handler, true);

session_start();

if ( isset($_SESSION['user_id']) === false ) {
    header("Location: login.php");
}

include 'backend/connection.php';

$stmt = $conn->prepare("SELECT value FROM settings WHERE id = 1");
$stmt->execute();

$result = $stmt->fetchAll();
$site_name = $result[0]["value"];


$stmt = $conn->prepare("SELECT first_name, last_name FROM users WHERE id = '" . $_SESSION['user_id'] . "'" );
$stmt->execute();

$result = $stmt->fetchAll();
$user_full_name = $result[0]["first_name"] . " " . $result[0]["last_name"];


# Get the Page Url Name, is it dumb I use 3 variables to get it? yes...
    $path       = $_SERVER["REQUEST_URI"];
    $path_split =  preg_split("#/#", $path);
    $page       = $path_split[2];
    $page_name  = ucfirst( substr($page, 0, count($page) - 5) ); #5 is the .php extension

?>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


    <title>
        <?php echo $site_name . " " . $page_name ?> </title>
    
    <link rel="stylesheet" href="style/style.css" >
    <link rel="stylesheet" href="style/shared.css" >

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 

    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/pell/dist/pell.min.css">
    
  </head>
  <body>



<nav class="navbar"> 
    <ul class="navbar-nav">
        <li <?php echo $page === "settings.php" ? "class=\"nav-item active-nav-item\" >" : "class=\"nav-item\" >"; ?>
            <a href="settings.php" > <i class="bi bi-gear"></i> </a>
        </li>
        <li <?php echo $page === "files.php" ? "class=\"nav-item active-nav-item\" >" : "class=\"nav-item\" >"; ?>
            <a href="files.php" > <i class="bi bi-folder2-open"></i> </a>
        </li>
        <li <?php echo $page === "pages.php" ? "class=\"nav-item active-nav-item\" >" : "class=\"nav-item\" >"; ?>
            <a href="pages.php" > <i class="bi bi-layout-text-window-reverse"></i> </a>
        </li>
        <li <?php echo $page === "posts.php" ? "class=\"nav-item active-nav-item\" >" : "class=\"nav-item\" >"; ?>
            <a href="posts.php"> <i class="bi bi-newspaper"></i> </a>
        </li>
        <li <?php echo $page === "users.php" ? "class=\"nav-item active-nav-item\" >" : "class=\"nav-item\" >"; ?>
            <a href="users.php" > <i class="bi bi-people"></i> </a>
        </li>
    </ul>
</nav>
