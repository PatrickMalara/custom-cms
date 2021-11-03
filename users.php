<?php include 'header.php'; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-people"> </i>

            <h3 id="users_heading"> Users </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>

        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>

        <br />

        <div id="app"> </div>


    </main>

    <!-- Load React. -->
    <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
    <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>  
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>

    <script src="react/build/UserItem.js"></script>
    <script src="react/build/UsersPage.js"></script>
    <script>
    </script>

  </body>
</html>
