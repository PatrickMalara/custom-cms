<?php include "header.php"; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-newspaper"> </i>

            <h3> Posts </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>
        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>


        <section class="shared-section-container "> 
            <div id="posts-container" class="shared-item-container"> </div>
        </section>
        <template id="post-component">
            <div class="shared-item-card clickable">
                <i class="bi bi-newspaper"></i>
                <span id="post-name"> </span>
            </div>
        </template>
        <template id="ghost-post-component"> 
            <div class="shared-ghost-item-card clickable">
                New Post 

                <i class="bi bi-plus" style="float: right; margin-top: -1px;"> </i>
            </div>
        </template>


        <section class="shared-section-container" style="width: calc(100% - 2rem);"> 
            <div style="width: 100%;" id="bind-post_content"> </div>
        </section>


    </main>


    <script src="https://unpkg.com/pell"></script>
    <script src="javascript/posts.js"></script>


</body>

</html>
