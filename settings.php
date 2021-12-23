<?php include 'header.php'; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-gear"> </i>

            <h3> Settings </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>
        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>

        <section id="settings-container" class="settings-section"> 

            <template id="settings-component">
                <div>
                    <p class="settings-label"> </p>
                    <input class="form-control" type="text" value="" />
                    <i class="bi bi-check clickable-icon" title="Save Changes"></i>
                </div>
            </template>
            
        </section>


    </main>


    <script src="javascript/settings.js"></script>

  </body>
</html>
