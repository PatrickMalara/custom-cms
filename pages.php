<?php include 'header.php'; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-layout-text-window-reverse"> </i>

            <h3> Editing <span id="current-page-name" style="color: purple;"> Home <span> </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>
        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>


        <section class="pages-section" >

            <h3> Pages </h3>

            <br />

            <div id="for-pages_array" class="item-container">
            </div>
            
        </section>


        <section class="sections-section" >

            <h3> Sections </h3>

            <br />

            <div class="sections-container">
                <div id="for-sections_array" class="sections-selection">
                    <div id="ghost-section-card" class="ghost-section-card"> New section </div>
                </div>

                <div class="sections-editor">
                    <button onclick="update_section_record_content()" class="" style="float: right; margin-top: -2.5rem;"> Save Changes </button>
                    <div id="bind-selected_section_content"> </div>
                </div>
            </div>
            
        </section>

    </main>


    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    <script src="javascript/pages.js"></script>
    
  </body>
</html>
