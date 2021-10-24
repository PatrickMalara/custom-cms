<?php

include 'backend/connection.php';

$stmt = $conn->prepare("SELECT value FROM settings WHERE id = 1");
$stmt->execute();

$result = $stmt->fetchAll();
$site_name = $result[0]["value"];

?>

<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">


    <title><?php echo $site_name; ?> Login</title>

    <link rel="stylesheet" href="style/style.css" >
    <link rel="stylesheet" href="style/shared.css" >


    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"> 

  </head>
  <body>

    <div class="login-container">

        <div>
            <h1 style="text-align: center;"> <?php echo $site_name; ?> </h1>

            <form action="backend/login_controller.php" method="POST">
                <label>Email</label>
                <input type="email" name="email" class="form-control"></input>
                <br>
                <br>

                <label>Password</label>
                <input type="password" name="password" class="form-control"></input>
                <br>
                <br>

                <button type="submit"> Login </button>
            </form>
        </div>

    </div>
    
  </body>
</html>

