<?php include 'header.php'; ?>

    <main>

        <section class="topbar"> 
        
            <i class="bi bi-folder2-open"> </i>

            <h3> Inside of&nbsp;&nbsp;<span id="current-directory-path" class="current-directory-path"> 
                <!-- <span class="active-directory">files</span> <b>/</b> <span class="path-directory">videography<span> -->
            </h3>

            <h3> 👋 Welcome, <?php echo $user_full_name; ?> </h3>

        </section>
        <div style="display:flex; justify-content: end;">
            <a href="backend/logout_controller.php" class="logout-text-btn">Logout</a>
        </div>


        <section class="folders-section" >

            <h3> Folder </h3>

            <br />

            <div id="for-folders_array" class="item-container">
            </div>
            
        </section>

        <section class="files-section" >

            <h3> Files </h3>

            <br />

            <form class="upload-box" action="backend/upload_controller.php" method="POST" enctype="multipart/form-data">
              <input type="file" name="file_to_upload" id="file_to_upload">
              <input style="display: none;" type="text" name="directory_path" id="directory_path" placeholder="Folder Path ex. home/images/">
              <button type="submit" name="submit"> Upload File </button>
            </form>

            <div id="for-files_array" class="files-container">
            </div>
            
        </section>

        <!-- The better way of doing this https://stackoverflow.com/questions/5587973/javascript-upload-file 
        <form onsubmit="upload_file" action="files_controller.php?action=upload&current_directory=" method="POST" enctype="multipart/form-data">
          Select image to upload:
          <input type="file" name="fileToUpload" id="fileToUpload">
          <input style="display: none;" type="text" name="directory_path" id="directory_path" placeholder="Folder Path ex. home/images/">
          <input type="submit" value="Upload Image" name="submit">
        </form>
-->
    </main>

    <script src="javascript/files.js"></script>

    
  </body>
</html>
