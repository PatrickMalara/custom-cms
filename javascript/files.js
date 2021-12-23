const state = {

    current_dir_path: "files",
    user_is_creating_a_folder: false,

    folders_array:  [],
    files_array:    [],

    set_current_dir_path: async function( updated_dir_path ) {

        let response = {};

        try {

            // Get the Folders and Files
            response = await fetch(`backend/files_controller.php?path=${updated_dir_path}`);
            response = await response.json();


            //Update our state
            this.current_dir_path = updated_dir_path;
            document.getElementById("directory_path").value = updated_dir_path;


            this.folders_array = response.folders;
            this.files_array   = response.files;


            // Render the files and folders
            const folders_container_element = document.getElementById("for-folders_array");
            folders_container_element.innerHTML = "";

            folders_container_element.appendChild( build_ghost_folder_element() );

            for (let i = 0; i < response.folders.length; i += 1) {
                folders_container_element.appendChild(
                    build_folder_element( response.folders[i] )
                ); 
            }

            const files_container_element = document.getElementById("for-files_array");
            files_container_element.innerHTML = "";
            for (let i = 0; i < response.files.length; i += 1) {
                files_container_element.appendChild(
                    build_file_element( response.files[i] )
                ); 
            }



            // Update the Folder Path Element
            const folders_in_path_array = state.current_dir_path.split('/');
            folders_in_path_array.pop();

            const curr_dir_path_el = document.getElementById( "current-directory-path" );
            curr_dir_path_el.innerHTML = "";

            for (let i = 0; i < ( folders_in_path_array.length - 1 ); i += 1) {

                const dir = document.createElement("span");
                dir.innerText = folders_in_path_array[i];
                dir.addEventListener( "click", function() {

                    const new_folder_path = folders_in_path_array.slice(0, i + 1 ).join('/') + '/';
        
                    state.set_current_dir_path( new_folder_path);
                } );

                const slash = document.createElement("b");
                slash.innerText = " / ";
                    
                curr_dir_path_el.appendChild( dir );
                curr_dir_path_el.appendChild( slash );
            }

            const dir = document.createElement("span");
            dir.innerText = folders_in_path_array[ folders_in_path_array.length-1 ];
                    
            curr_dir_path_el.appendChild( dir );


        } catch( error ) {
            console.error( error );
        }
    }
};


async function create_folder_record() {
    
    const new_folder_text_input = document.getElementById( "new-folder-text-input" );

    const new_folder_name = new_folder_text_input.value;

    let response = {};

    try {
        
        response = await fetch("backend/files_controller.php", {
            method: "post",
            body: JSON.stringify( {
                path:           state.current_dir_path,
                folder_name:    new_folder_name
            } )
        } );


        // Update the DOM
        const folders_container_element = document.getElementById("for-folders_array");
        folders_container_element.appendChild(
            build_folder_element( new_folder_name )
        );

        // Update the state
        state.folders_array.push( new_folder_name );

        //Reset the Ghost Folder
        reset_ghost_folder_card();

    } catch( error ) {
        console.log("Error Creating a Folder: ", error );
    }

}


function reset_ghost_folder_card() {

    const ghost_folder_element = document.getElementById( "ghost-folder-card" );

    ghost_folder_element.innerHTML = build_ghost_folder_element().innerHTML; 

    // Because of Event Propigation, we have to wait for 
    // The Ghost Elements eventListener to finish
    setTimeout( function() {
        state.user_is_creating_a_folder = false;
    }, 100 );

}


function transform_ghost_folder_element() {
    const ghost_el = document.getElementById("ghost-folder-card");

    ghost_el.innerHTML = `
        <input id="new-folder-text-input" class="form-control" placeholder="Folder Name" />
        
        <i onclick="create_folder_record()" tabindex="0" class="bi bi-plus clickable-icon" style="float: right; margin-left: calc( 0.5rem ); margin-top: 0px;"></i>
        <i onclick="reset_ghost_folder_card()" class="bi bi-arrow-left-short clickable-icon" style="float: right; margin-top: 0px;"></i>
    `;

    
    document.getElementById( "new-folder-text-input" ).focus();

}


function build_file_element( file_name ) {
    const new_file_element = document.createElement("div");

    new_file_element.classList.add( "item-card" );
    new_file_element.classList.add( "file-card" );
    new_file_element.classList.add( "clickable" );
    new_file_element.dataset.name = file_name;
    new_file_element.innerHTML = `
        <i class="bi bi-file-earmark"> </i>
        <span> ${file_name} </span>
    `;

    return new_file_element;
}


function build_folder_element( folder_name ) {
    const new_folder_element = document.createElement("div");

    new_folder_element.classList.add( "item-card" );
    new_folder_element.classList.add( "folder-card" );
    new_folder_element.classList.add( "clickable" );
    new_folder_element.dataset.name = folder_name;
    new_folder_element.innerHTML = `
        <i class="bi bi-folder2-open"> </i>
        <span> ${folder_name} </span>
    `;

    new_folder_element.addEventListener( 
        "dblclick", 
        () => { 
            state.set_current_dir_path( 
                state.current_dir_path + folder_name + "/"
            )
        } 
    );

    return new_folder_element;
}


function build_ghost_folder_element() {
    const ghost_folder_element = document.createElement("div");

    ghost_folder_element.classList.add( "ghost-folder-card" );
    ghost_folder_element.id = "ghost-folder-card";
    ghost_folder_element.classList.add( "clickable" );
    ghost_folder_element.innerHTML = `
        <span> New Folder </span>

        <i class="bi bi-plus" style="float: right; margin-top: -1px;"> </i>
    `;

    ghost_folder_element.addEventListener( 
        "click", 
        () => { 
            if ( state.user_is_creating_a_folder === false ) { 
                state.user_is_creating_a_folder = true;
                transform_ghost_folder_element();
            }
        } 
    );

    return ghost_folder_element;
}


(async function main() {

    state.set_current_dir_path( "files/" );

})();


